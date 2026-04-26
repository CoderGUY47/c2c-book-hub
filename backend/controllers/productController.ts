        return response(res, 500, 'Internal Server Error');
    }
}


export const getProductById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as any;
        let query;


        if (mongoose.Types.ObjectId.isValid(id)) {
            query = { _id: id };
        } else {
            // Check if valid ObjectId exists at the end of the slug (Pattern: ...-objectid)
            const idMatch = id.match(/-([0-9a-fA-F]{24})$/);
            
            if (idMatch) {
               // If ID found at end, use it
               query = { _id: idMatch[1] };
            } else {
               // Fallback: search by title (replace dashes with spaces)
               const titleQuery = id.replace(/-/g, ' ');
               query = { title: { $regex: new RegExp(`^${titleQuery}$`, 'i') } };
            }
        }


        const product = await Products.findOne(query)
            .populate({
                path: 'seller',
                select: 'name email profilePicture phoneNumber addresses',
                populate: {
                    path: 'addresses',
                    model: 'Address'
                }
            });


        if (!product) {
            return response(res, 404, 'Product not found');
        }
        return response(res, 200, 'Products fetched successfully', product);
    }
    catch (error) {
        console.error('Error fetching products:', error);
        return response(res, 500, 'Internal Server Error');
    }
}




//delete product by id
export const deleteProduct= async (req: Request, res: Response) => {
    try{
        const product = await Products.findByIdAndDelete(req.params.productId) // Assuming authenticatedUser middleware adds user to req
        if(!product){
            return response(res,404,'Product not found');
        }
        return response(res, 200, 'Products deleted successfully', product);
    }
    catch(error){
        console.error('Error fetching products:', error);
        return response(res, 500, 'Internal Server Error');
    }
}






//get products by seller id
export const getProductBySellerId = async(req: Request, res:Response)=>{
    try{
        const sellerId = req.params.sellerId as any;  // Get sellerId from request parameters
        if(!sellerId){
            return response(res,400,'Product of this seller is not found, please try again with valid id.');
        }


        const product = await Products.find({seller: sellerId}) // Find products by sellerId
        .sort({createdAt:-1}) //newest products first
        .populate('seller', 'name email profilePicture phoneNumber addresses') //select specific fields to return
