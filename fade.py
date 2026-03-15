from PIL import Image
import numpy as np

# Load the image
img = Image.open('IMG-nobg.png').convert('RGBA')
arr = np.array(img)

# Get image dimensions
height, width, _ = arr.shape

# Define fading start point (e.g., 85% of the way down)
fade_start = int(height * 0.85)
fade_distance = height - fade_start

# Create an alpha mask
# Alpha should drop off slowly at first (quadratic) to keep the suit visible longer
alpha_mask = np.ones((height, width))
y_coords = np.arange(height)[:, np.newaxis]
normalized_dist = (y_coords - fade_start) / fade_distance
alpha_mask = np.where(y_coords > fade_start, 1.0 - (normalized_dist ** 2), alpha_mask)

# Clip the mask directly if any values go below 0 (though our math shouldn't)
alpha_mask = np.clip(alpha_mask, 0, 1)

# Apply the mask to the alpha channel
arr[:, :, 3] = (arr[:, :, 3] * alpha_mask).astype(np.uint8)

# Convert back to PIL Image and save
result = Image.fromarray(arr)
result.save('IMG-faded.png')
print("Image saved successfully.")
