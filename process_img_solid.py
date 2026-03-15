from PIL import Image, ImageEnhance, ImageFilter
import numpy as np
from scipy.ndimage import gaussian_filter

def process_hero_image(input_path, output_path):
    img = Image.open(input_path).convert('RGBA')
    
    # Enhance Brightness and Contrast
    enhancer_contrast = ImageEnhance.Contrast(img)
    img = enhancer_contrast.enhance(1.15)
    enhancer_brightness = ImageEnhance.Brightness(img)
    img = enhancer_brightness.enhance(1.05)

    arr = np.array(img)
    alpha = arr[:, :, 3].astype(float)
    
    # Soften/Feather edges
    alpha = gaussian_filter(alpha, sigma=1.5)
    
    arr[:, :, 3] = np.clip(alpha, 0, 255).astype(np.uint8)

    final_img = Image.fromarray(arr)
    final_img.save(output_path)
    print("Enhanced solid image saved.")

if __name__ == "__main__":
    process_hero_image('IMG-nobg.png', 'IMG-enhanced.png')
