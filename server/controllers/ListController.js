const { ListModel } = require("../models/ListModel.js");

const createList = async (req, res) => {
  try {
    const list = await ListModel.create(req.body);
    return res.status(201).json({ success: true, list });
  } catch (error) {
    return res.status(500).json({ success: true, error });
  }
};

const deleteList = async (req, res) => {
  try {
    const listDetails = await ListModel.findById(req.params.id);
    const list = await ListModel.findByIdAndDelete(req.params.id);
    return res.status(201).json({
      success: true,
      message: `List ${listDetails.name} Deleted`,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }
};

const editList = async (req, res) => {
  try {
    const list = await ListModel.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      description: req.body.description,
      address: req.body.address,
      type: req.body.type,
      bedrooms: req.body.bedrooms,
      bathrooms: req.body.bathrooms,
      regularPrice: req.body.regularPrice,
      discountPrice: req.body.discountPrice,
      offer: req.body.offer,
      parking: req.body.parking,
      furnished: req.body.furnished,
      imageUrls: req.body.imageUrls,
    });
    return res
      .status(201)
      .json({ success: true, message: `${req.body.name} List Edited` });
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }
};

const getList = async (req, res) => {
  try {
    const list = await ListModel.findById(req.params.id);
    return res.status(201).json({ success: true, list });
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }
};

const getLists = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    let offer = req.query.offer;

    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;

    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;

    if (parking === undefined || parking === "false") {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;

    if (type === undefined || type === "all") {
      type = { $in: ["sell", "rent"] };
    }

    const searchTerm = req.query.searchTerm || "";
    const sort = req.query.sort || "createdAt";
    const order = req.query.order || "desc";

    const list = await ListModel.find({
      name: { $regex: searchTerm, $options: "i" },
      type,
      offer,
      parking,
      furnished,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);
    return res.status(201).json({ success: true, list });
  } catch (error) {
    return res.status(500).json({ success: false, message:error.message });
    
    
  }
};

module.exports = { createList, deleteList, editList, getList, getLists };
