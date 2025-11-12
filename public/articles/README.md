# Article Cover Images

This folder contains cover images for articles displayed on the SalSacEV website.

## Image Requirements

- **Format**: JPG, PNG, or WebP
- **Recommended Size**: 1200x630px (optimized for social sharing)
- **Aspect Ratio**: 16:9 or 1.91:1
- **File Size**: Keep under 500KB for best performance

## Naming Convention

Use descriptive, lowercase names with hyphens:
- `ev-salary-sacrifice-guide.jpg`
- `bik-rates-2025.jpg`
- `top-10-electric-cars.jpg`

Avoid generic names like `image1.jpg` or `cover.jpg`

## How to Add a Cover Image

1. **Add your image** to this folder (`/public/articles/`)
2. **Update the MDX file** in `/content/articles/your-article.mdx`
3. **Change the frontmatter**:
   ```yaml
   ---
   coverImage: "/articles/your-image.jpg"
   ---
   ```
4. **Save and refresh** - Next.js will automatically optimize the image

## Current Images

- `cover-ev-guide.jpg` - Used by: The Complete Guide to EV Salary Sacrifice in 2025
- `cover-bik-rates.jpg` - Used by: BIK Rates Explained 2025
- `cover-top-10-evs.jpg` - Used by: Top 10 Electric Cars for Salary Sacrifice

## Image Optimization

Next.js automatically optimizes images using the Image component:
- Lazy loading
- Responsive sizes
- WebP conversion
- Blur placeholder

No additional build steps required!
