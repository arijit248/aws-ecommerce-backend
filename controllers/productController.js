const ProductController = require("../models/productModel");
const { S3 } = require("@aws-sdk/client-s3");
const { ObjectId } = require("mongodb");
const { blobUrlToBuffer } = require("../utils/commonFunction.js");

const s3 = new S3({
  region: "eu-north-1",
  credentials: {
    accessKeyId: "", // Replace with your AWS Access Key ID
    secretAccessKey: "", // Replace with your AWS Secret Access Key
  },
});

exports.saveProduct = async (req, res, next) => {
  const { userId, name, color, brand, price, type } = req.body;
  // console.log(req.body, "imgData", req.files);
  const { image } = req.files;
  console.log(image, "image");
  const images = [];

  if (Array.isArray(image) === true) {
    for (let i = 0; i < image.length; i++) {
      // console.log(image[i], "sdjasgajgjaaj");
      const s3UploadParams = {
        Bucket: "e-commerce-trial",
        Key: image[i].name,
        Body: image[i].data, // Buffer from the uploaded file
        ContentType: image[i].mimetype,
      };
      console.log(s3UploadParams, "s3UploadParams");
      await s3.putObject(s3UploadParams);
      const imageToSave = `https://e-commerce-trial.s3.eu-north-1.amazonaws.com/${s3UploadParams.Key}`;
      images.push(imageToSave);
    }
  } else {
    const s3UploadParams = {
      Bucket: "e-commerce-trial",
      Key: image.name,
      Body: image.data, // Buffer from the uploaded file
      ContentType: image.mimetype,
    };
    console.log(s3UploadParams, "s3UploadParams");
    await s3.putObject(s3UploadParams);
    const imageToSave = `https://e-commerce-trial.s3.eu-north-1.amazonaws.com/${s3UploadParams.Key}`;
    images.push(imageToSave);
  }

  console.log(images, "images");
  // // Upload image to S3
  // const s3UploadParams = {
  //   Bucket: "e-commerce-trial",
  //   Key: image.name,
  //   Body: image.data, // Buffer from the uploaded file
  //   ContentType: image.mimetype,
  // };
  // console.log(s3UploadParams, "s3UploadParams");
  // await s3.putObject(s3UploadParams);
  // const imageToSave = `https://e-commerce-trial.s3.eu-north-1.amazonaws.com/${s3UploadParams.Key}`;
  const addProduct = new ProductController(
    new ObjectId(userId),
    name,
    color,
    brand,
    images,
    price,
    type
  );
  addProduct
    .saveProduct()
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      console.log(err);
      next();
    });
};

exports.products = (req, res, next) => {
  ProductController.products()
    .then((products) => {
      res.status(200).send(products);
    })
    .catch((err) => {
      console.log(err);
      next();
    });
};

exports.productDetails = (req, res, next) => {
  const { id } = req.query;
  ProductController.productDetails(id)
    .then((productDetails) => {
      res.status(200).send(productDetails);
    })
    .catch((err) => {
      console.log(err);
      next();
    });
};

exports.orderDetails = (req, res, next) => {
  // const { id } = req.body;
  const { id } = req.query;
  console.log(id, "req");
  ProductController.orderByProductId(id)
    .then((orderDetails) => {
      res.status(200).send(orderDetails);
    })
    .catch((err) => {
      console.log(err);
      next();
    });
};

exports.productDeleteById = (req, res, next) => {
  const { id } = req.body;
  ProductController.productDeleteById(id)
    .then((delItem) => {
      res.status(200).send(delItem);
    })
    .catch((err) => {
      console.log(err);
      next();
    });
};

exports.productUpdateByImage = async (req, res, next) => {
  const { id, deleteImage } = req.body;
  const { image } = req.files;
  // console.log(id, image, "hauaduaduaud");
  const updateImages = [];

  // console.log(deleteImage, "deleteImage", typeof deleteImage);
  const newDeleteImage = JSON.parse(deleteImage || []);
  // console.log(newDeleteImage, "fwuebfuwfueowfuowfuowfueow");
  if (newDeleteImage) {
    for (let i = 0; i < newDeleteImage.length; i++) {
      console.log(newDeleteImage[i], "gfhhhddddd");
      const s3DeleteParams = {
        Bucket: "e-commerce-trial",
        Key: newDeleteImage[i],
      };
      await s3.deleteObject(s3DeleteParams);
    }
  }

  if (image) {
    if (Array.isArray(image) === true) {
      for (let i = 0; i < image.length; i++) {
        // console.log(image[i], "sdjasgajgjaaj");
        const s3UploadParams = {
          Bucket: "e-commerce-trial",
          Key: image[i].name,
          Body: image[i].data, // Buffer from the uploaded file
          ContentType: image[i].mimetype,
        };
        // console.log(s3UploadParams, "s3UploadParams");
        await s3.putObject(s3UploadParams);
        // await s3.deleteObject(s3DeleteParams);
        const imageToSave = `https://e-commerce-trial.s3.eu-north-1.amazonaws.com/${s3UploadParams.Key}`;
        updateImages.push(imageToSave);
      }
    } else {
      const s3UploadParams = {
        Bucket: "e-commerce-trial",
        Key: image.name,
        Body: image.data, // Buffer from the uploaded file
        ContentType: image.mimetype,
      };
      // console.log(s3UploadParams, "s3UploadParams");
      await s3.putObject(s3UploadParams);
      // await s3.deleteObject(s3DeleteParams);
      const imageToSave = `https://e-commerce-trial.s3.eu-north-1.amazonaws.com/${s3UploadParams.Key}`;
      updateImages.push(imageToSave);
    }
  }
  // console.log(updateImages, "updateImages");
  ProductController.productUpdatedByImage(id, updateImages)
    .then((updateItem) => {
      res.status(200).send(updateItem);
    })
    .catch((err) => {
      console.log(err);
      next();
    });
};
