import cloudinary from 'cloudinary';

const deletefromCloudinary = async (fileUrl) => {
  try {
    const parts=fileUrl.split('/');
    const fileName=parts[parts.length - 1];
    const publicId=fileName.split('.')[0];

    await cloudinary.v2.uploader.destroy(publicId,{
        resource_type: 'raw'
    });
  }
    catch (error) {
    console.error('Error deleting file from Cloudinary:', error.message);
    throw error;
  }
};

export default deletefromCloudinary;
