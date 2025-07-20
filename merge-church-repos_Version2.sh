#!/bin/bash
# Script to merge shepherd-connect-church and bucu repos into a unified web app

set -e

SHEPHERD_REPO="https://github.com/KIREX01/shepherd-connect-church.git"
BUCU_REPO="https://github.com/KIREX01/bucu.git"
MERGED_REPO_DIR="shepherd-connect-church-merged"

echo "Cloning repositories..."
git clone "$SHEPHERD_REPO" "$MERGED_REPO_DIR"
git clone "$BUCU_REPO" bucu-temp

cd "$MERGED_REPO_DIR"

echo "Creating 'frontend' folder for BUCU contents..."
mkdir -p frontend

echo "Moving BUCU files into 'frontend'..."
rsync -av --exclude='.git' ../bucu-temp/ frontend/

echo "Resolving README conflicts..."
if [ -f README.md ] && [ -f frontend/README.md ]; then
    mv frontend/README.md frontend/README_BUCU.md
fi

echo "Cleaning up temporary BUCU repo..."
cd ..
rm -rf bucu-temp

echo "Merge complete!"
echo "Next Steps:"
echo "1. Review the 'frontend' folder inside '$MERGED_REPO_DIR' and resolve any duplicate files (like index.html)."
echo "2. Unify navigation, branding, and styles as needed."
echo "3. Test the app locally before deployment."
echo "4. Update README.md in '$MERGED_REPO_DIR' to document the merged project."

# Optional: open the merged repo in VS Code if installed
# code "$MERGED_REPO_DIR"