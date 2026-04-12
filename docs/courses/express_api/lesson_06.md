# Lesson 06 — File Uploads with Multer

> **Course:** Express API · **Time:** 45 minutes
> **🔗 Official Docs:** [Multer](https://github.com/expressjs/multer)

---

## 🎯 Learning Objectives

- [ ] Accept multipart/form-data file uploads
- [ ] Validate file type and size before accepting
- [ ] Store files on disk and in memory
- [ ] Return a usable URL for the uploaded file

---

## 📖 Concepts

### Why Multipart?

Regular `express.json()` only handles JSON. File uploads use `Content-Type: multipart/form-data`, which interleaves binary file data with form fields.

```
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary

------WebKitFormBoundary
Content-Disposition: form-data; name="title"

My avatar
------WebKitFormBoundary
Content-Disposition: form-data; name="avatar"; filename="photo.jpg"
Content-Type: image/jpeg

<binary data>
------WebKitFormBoundary--
```

Multer parses this so you can access files at `req.file` and form fields at `req.body`.

```bash
npm install multer
npm install -D @types/multer
```

### Basic Setup

```typescript
import multer from 'multer';
import path   from 'node:path';
import { randomUUID } from 'node:crypto';

// Disk storage — saves files to the filesystem
const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');   // Ensure this directory exists
    },
    filename: (req, file, cb) => {
        // Prevent path traversal and name collisions
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `${randomUUID()}${ext}`);
    },
});

// File filter — accept only images
function imageFilter(
    req: Express.Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
): void {
    const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (ALLOWED.includes(file.mimetype)) {
        cb(null, true);    // Accept
    } else {
        cb(new Error('Only JPEG, PNG, WebP, and GIF files are allowed'));
    }
}

export const uploadImage = multer({
    storage:  diskStorage,
    limits:   { fileSize: 5 * 1024 * 1024 },  // 5 MB max
    fileFilter: imageFilter,
});
```

### Single File Upload

```typescript
// POST /users/:id/avatar
// FormData: avatar (file)
router.post(
    '/:id/avatar',
    authenticate,
    uploadImage.single('avatar'),    // Field name 'avatar' in the form
    asyncHandler(async (req, res) => {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // req.file is typed as Express.Multer.File
        const { filename, mimetype, size, path: filePath } = req.file;

        // Save the file path to the user record in your DB
        const url = `/uploads/${filename}`;
        await userService.updateAvatar(Number(req.params.id), url);

        res.json({
            url,
            filename,
            mimetype,
            size,
        });
    })
);
```

### Multiple File Upload

```typescript
// POST /posts/:id/images — up to 5 images
router.post(
    '/:id/images',
    authenticate,
    uploadImage.array('images', 5),    // Max 5 files, field name 'images'
    asyncHandler(async (req, res) => {
        const files = req.files as Express.Multer.File[];
        if (!files?.length) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        const urls = files.map(f => `/uploads/${f.filename}`);
        await postService.addImages(Number(req.params.id), urls);

        res.json({ urls, count: files.length });
    })
);
```

### Memory Storage (for processing before saving)

```typescript
// Use memoryStorage when you need to process (resize, validate EXIF) before disk
const memoryUpload = multer({
    storage: multer.memoryStorage(),      // req.file.buffer, not a path
    limits:  { fileSize: 2 * 1024 * 1024 },  // 2 MB
    fileFilter: imageFilter,
});

// Example: resize before saving (use sharp: npm install sharp)
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';

router.post(
    '/profile/avatar',
    authenticate,
    memoryUpload.single('avatar'),
    asyncHandler(async (req, res) => {
        if (!req.file) return res.status(400).json({ error: 'No file' });

        const filename = `${randomUUID()}.webp`;
        const outPath  = path.join('uploads', filename);

        // Resize to 256×256, convert to WebP, optimise
        await sharp(req.file.buffer)
            .resize(256, 256, { fit: 'cover' })
            .webp({ quality: 80 })
            .toFile(outPath);

        res.json({ url: `/uploads/${filename}` });
    })
);
```

### Serving Uploaded Files

```typescript
// In app.ts — serve the uploads directory as static
import path from 'node:path';
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// POST /users/1/avatar → saves file → returns { url: '/uploads/abc-123.jpg' }
// GET  /uploads/abc-123.jpg → served as a static file
```

> [!WARNING]
> In production, serve uploaded files from an object store (AWS S3, Cloudflare R2, DigitalOcean Spaces) — not from the Node.js server. Use `multer-s3` for direct-to-S3 uploads.

---

## ✅ Milestone Checklist

- [ ] My upload route rejects non-image MIME types with a 400
- [ ] Filenames are UUIDs — never the original `file.originalname`
- [ ] File size is limited (I chose a limit appropriate to my use case)
- [ ] Uploaded files are served via `express.static`

## ➡️ Next Unit

[Lesson 07 — Testing Express APIs with Vitest + Supertest](./lesson_07.md)
