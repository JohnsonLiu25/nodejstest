from PIL import Image
def resize(image):
	image = Image.open(image)
	width  = image.size[0]
	height = image.size[1]

	aspect = width / float(height)

	ideal_width = int(256*1.91)
	ideal_height = 256

	ideal_aspect = ideal_width / float(ideal_height)

	if aspect > ideal_aspect:
	    # Then crop the left and right edges:
	    new_width = int(ideal_aspect * height)
	    offset = (width - new_width) / 2
	    resize = (offset, 0, width - offset, height)
	else:
	    # ... crop the top and bottom:
	    new_height = int(width / ideal_aspect)
	    offset = (height - new_height) / 2
	    resize = (0, offset, width, height - offset)
	thumb = image.crop(resize).resize((ideal_width, ideal_height), Image.ANTIALIAS)
	return thumb
canvas = Image.new('RGB',(int(512*1.91),512))
im_1 = resize('a.jpg')
im_2 = resize('b.jpg')
im_3 = resize('c.jpg')
im_4 = resize('e.jpg')
canvas.paste(im_1,(0,0))
canvas.paste(im_2,(0,256))
canvas.paste(im_3,(int(256*1.91),0))
canvas.paste(im_4,(int(256*1.91),256))
canvas.save('collage.jpg')