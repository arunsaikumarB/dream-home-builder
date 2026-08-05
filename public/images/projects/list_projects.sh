#!/bin/bash

for dir in */; do
    dirname=${dir%/}
    
    echo "---------------------------------------"
    echo "Folder: [$dirname]"
    
    # We ask for the prefix (e.g., "bath")
    read -p "Enter the filename prefix (e.g. bath): " prefix
    
    # 1. find: grabs the files
    # 2. sed: wraps them in single quotes
    # 3. sort -V: This is the "Magic" that sorts 1, 2, 10, 11 correctly (Version Sort)
    # 4. paste: joins them with commas
    files=$(find "$dir" -maxdepth 1 -name "${prefix}-*" -type f -exec basename {} \; \
            | sed "s/.*/'&'/" \
            | sort -V)

    if [ -z "$files" ]; then
        echo "No files found matching '${prefix}-' in this folder."
    else
        echo "Your JS Array content (Sorted Numerically):"
        echo "$files" | paste -sd, -
    fi
done

echo "---------------------------------------"
echo "Done!"
