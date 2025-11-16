import { v2 as cloudinary } from 'cloudinary';


cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
	secure: true,
});
 
export async function uploadImage(source, options = {}) {
	return cloudinary.uploader.upload(source, {
		resource_type: 'image',
		folder: options.folder,
	});
}

export { cloudinary };
export default cloudinary;

