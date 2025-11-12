# Author Avatar Images

This folder contains profile pictures for article authors on the SalSacEV website.

## Image Requirements

- **Format**: JPG, PNG, or WebP
- **Recommended Size**: 400x400px (square)
- **Aspect Ratio**: 1:1 (square)
- **File Size**: Keep under 200KB

## Naming Convention

Use the author's name in lowercase with hyphens:
- `sarah-mitchell.jpg`
- `james-patterson.jpg`
- `emma-thompson.jpg`

## How to Add an Author Avatar

1. **Add the avatar image** to this folder (`/public/authors/`)
2. **Update the MDX file** in `/content/articles/your-article.mdx`
3. **Add to the author section** in frontmatter:
   ```yaml
   ---
   author:
     name: "Author Name"
     avatar: "/authors/author-name.jpg"
   ---
   ```
4. **Save and refresh** - the avatar will appear automatically

## Current Authors

- `sarah-mitchell.jpg` - Author of EV Salary Sacrifice guides
- `james-patterson.jpg` - Author of BIK tax articles
- `emma-thompson.jpg` - Author of EV comparison articles

## Fallback Behavior

If no avatar is provided (empty string or missing file), the components will display:
- A placeholder circle with the author's initials
- This ensures the layout looks good even without images

## Tips

- Use professional headshots or profile pictures
- Ensure good lighting and clear faces
- Square crop works best for circular display
- Consider using the same background style for consistency
