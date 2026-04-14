const mongoose = require('mongoose');
const { slugify } = require('transliteration');

async function generateUniqueSlug(model, name, docId) {
  const baseSlug = slugify(name, {
    lowercase: true,
    separator: '-',
    trim: true,
  });

  let slug = baseSlug;
  let counter = 1;

  while (
    await model.findOne({
      slug,
      _id: { $ne: docId },
    })
  ) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    group: {
      type: String,
      required: true,
      enum: ['food', 'drinks'],
    },

    order: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

categorySchema.pre('validate', async function (next) {
  if (!this.name) return next();

  this.slug = await generateUniqueSlug(this.constructor, this.name, this._id);
  next();
});

categorySchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate();

  if (!update) return next();

  const nextName = update.name || (update.$set && update.$set.name);
  if (!nextName) return next();

  const currentDoc = await this.model.findOne(this.getQuery()).select('_id');
  if (!currentDoc) return next();

  const newSlug = await generateUniqueSlug(this.model, nextName, currentDoc._id);

  if (update.$set) {
    update.$set.slug = newSlug;
  } else {
    update.slug = newSlug;
  }

  next();
});

module.exports = mongoose.model('Category', categorySchema);