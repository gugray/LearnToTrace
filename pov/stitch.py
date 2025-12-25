from PIL import Image

folder = "sky-tile1"

# Load images
faces = ['px','nx','py','ny','pz','nz']
imgs = [Image.open(f"{folder}/{f}.jpg") for f in faces]

# Assume all faces are same size
w, h = imgs[0].size

# Create cubemap layout (horizontal cross)
cubemap = Image.new('RGB', (4*w, 3*h))

# Paste faces (common horizontal cross layout)
cubemap.paste(imgs[0], (2*w, h))  # px
cubemap.paste(imgs[1], (0, h))    # nx
cubemap.paste(imgs[2], (w, 0))    # py
cubemap.paste(imgs[3], (w, 2*h))  # ny
cubemap.paste(imgs[4], (w, h))    # pz
cubemap.paste(imgs[5], (3*w, h))  # nz

cubemap.save(f"{folder}/cubemap.png")
