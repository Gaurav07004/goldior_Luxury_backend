import Product from "../models/product.model.js";

const recommendFragrances = async (req, res) => {
  try {
    const { message } = req.body;
    const keyword = message.toLowerCase();

    const allKeynotes = [
      "woody",
      "fresh",
      "citrus",
      "mint",
      "aqua",
      "jasmine",
      "vanilla",
      "rose",
      "musk",
      "amber",
      "sandalwood",
    ];

    // 1. Extract matched fragrance notes
    const matchedNotes = allKeynotes.filter((note) => keyword.includes(note));

    // 2. Extract price filters
    let priceFilter = {};
    const priceRegex = /(?:under|below)\s?₹?(\d+)/i;
    const aboveRegex = /(?:above|over)\s?₹?(\d+)/i;

    const underMatch = keyword.match(priceRegex);
    const aboveMatch = keyword.match(aboveRegex);

    // Adjust price logic when both conditions exist
    if (underMatch && aboveMatch) {
      const underPrice = parseInt(underMatch[1]);
      const abovePrice = parseInt(aboveMatch[1]);

      priceFilter = {
        capacityInML: {
          $elemMatch: {
            price: { $lte: underPrice, $gte: abovePrice },
          },
        },
      };
    } else if (underMatch) {
      priceFilter = {
        capacityInML: {
          $elemMatch: { price: { $lte: parseInt(underMatch[1]) } },
        },
      };
    } else if (aboveMatch) {
      priceFilter = {
        capacityInML: {
          $elemMatch: { price: { $gte: parseInt(aboveMatch[1]) } },
        },
      };
    }

    // 3. Build query
    let query = {};

    if (matchedNotes.length > 0) {
      query["keynotes.name"] = {
        $in: matchedNotes.map((n) => new RegExp(n, "i")),
      };
    }

    if (Object.keys(priceFilter).length > 0) {
      query = { ...query, ...priceFilter };
    }

    // Debug Logs
    console.log("🔍 Query:", query);

    // 4. Execute query
    let perfumes = await Product.find(query).limit(3);
    console.log("🎯 Matches found:", perfumes.length);

    // 5. Fallback if empty
    if (perfumes.length === 0) {
      perfumes = await Product.find().limit(3);
    }

    // 6. Format for frontend
    const reply = perfumes.map((p) => ({
      name: p.name,
      description: p.description,
      price: `₹${p.capacityInML[0]?.price || "N/A"}`,
      notes: p.keynotes.map((k) => k.name),
    }));

    res.status(200).json({ reply });
  } catch (err) {
    console.error("💥 Error in recommendation:", err.message);
    res.status(500).json({ reply: [] });
  }
};

export default recommendFragrances;
