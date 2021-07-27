
// modules
const { ApolloError } = require('apollo-server-express');

// Models
const Product = require('../../models/Products');
const User = require('../../models/Users');


module.exports = {

    addProductToCart: async (_parent, args) => {
        try {
            const user = await User.findById(args.userId);
            console.log(user)
            // get the user's prop inTheirCart and set as dictionary
            const dictionary = JSON.parse(user.cart);
            dictionary[args.productId] = args.userId;
            // string the dictionary and save it to the db
            user.cart = JSON.stringify(dictionary);
            await user.save();

            return {
                _id: user.id,
                username: user.username,
                email: user.email,
                cart: (async () => {
                    const array = [];

                    const userCart = JSON.parse(user.cart)
                    const keys = Object.keys(userCart);
                    for(let i = 0; i < keys.length; i++) {
                        array.push(await Product.findById(keys[i]))
                    }
                    return array
                })()
            };
        } catch(err) {
            console.log(err);
            throw new ApolloError(`Unable to add new product to cart, bad request!`);
        }
    },

    products: async () => {
        try {
            console.log('test')
            return Product.find().then(products => products.map(product => {
                return {
                    _id: product.id,
                    name: product.name,
                    price: JSON.stringify(product.price),
                    summary: product.summary,
                    createdBy: product.createdBy,
                    department: product.department,
                    viewCount: product.viewCount,
                    image: product.image
                }
            }))
        } catch(err) {
            console.log(err)
            throw new ApolloError(`Unable to grab product, please check connection!`)
        }
    },

    addProduct: async function( _parent, args) {
        try {
            const product = await Product.create({
                name: args.name,
                price: parseInt(args.price),
                department: args.department,
                summary: args.summary,
                createdBy: args.createdBy,
                inTheirCart: "[]",
                viewCount: parseInt(args.viewCount),
                image: args.image
            });
            console.log(`${args.createdBy} has been uploaded to the database`);

            return {
                name: product.name,
                price: JSON.stringify(product.price),
                department: product.department,
                summary: product.summary,
                createdBy: product.createdBy,
                viewCount: JSON.stringify(product.viewCount),
                inTheirCart: "[]"
            }
        } catch (err) {
            console.log(err)
            throw new ApolloError(`Unable to add new product ${args.name}, bad request!`)
        }
    },

    // remove from cart 
    removeProductFromCart: async function( _parent, args ) {
        
        try {
            // we want to find the user and return the user for the query
            const user = await User.findById(args.userId);
            // We want to use Product model to find by id of the 
            return {
                _id: user.id,
                username: user.username,
                cart: ( async () => {
                    cart = JSON.parse(user.cart);
                    delete cart[args.productId];
                    user.cart = JSON.stringify(cart);

                    await user.save();
                    
                    const array = [];
                    const keys = Object.keys(cart);

                    for(let i = 0; i < keys.length; i++ ) {
                        console.log(keys)
                        array.push(await Product.findById(keys[i]))
                    }
                    return array;
                })()
            }
        } catch(err) {
            console.log(err);
            throw new ApolloError('Unable to remove cart, bad request!')
        }
    },

    resetCart: async function( _parent, args ) {
        try {
            const user = await User.findById(args.userId);
            // set the user's cart prop to a empty dictionary
            user.cart = "{}";
            user.save();

            return user
        } catch (err) {
            console.log(err)
            throw new ApolloError(`Unable to reset cart, bad request!`);
        }
    }
}