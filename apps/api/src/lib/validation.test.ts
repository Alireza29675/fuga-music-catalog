import {
  contributorSchema,
  createProductSchema,
  updateProductSchema,
  createArtistSchema,
  loginSchema,
} from './validation';

describe('Validation Schemas', () => {
  describe('contributorSchema', () => {
    it('should validate a valid contributor with artistId and contributionTypeId', () => {
      const validContributor = {
        artistId: 1,
        contributionTypeId: 2,
      };

      const result = contributorSchema.safeParse(validContributor);
      expect(result.success).toBe(true);
    });

    it('should validate a valid contributor with only artistId', () => {
      const validContributor = {
        artistId: 1,
      };

      const result = contributorSchema.safeParse(validContributor);
      expect(result.success).toBe(true);
    });

    it('should reject contributor without artistId', () => {
      const invalidContributor = {
        contributionTypeId: 2,
      };

      const result = contributorSchema.safeParse(invalidContributor);
      expect(result.success).toBe(false);
    });

    it('should reject contributor with invalid artistId type', () => {
      const invalidContributor = {
        artistId: 'not-a-number',
        contributionTypeId: 2,
      };

      const result = contributorSchema.safeParse(invalidContributor);
      expect(result.success).toBe(false);
    });
  });

  describe('createProductSchema', () => {
    it('should validate a valid product', () => {
      const validProduct = {
        name: 'Test Album',
        coverArtId: 1,
        contributors: [
          { artistId: 1, contributionTypeId: 1 },
          { artistId: 2 },
        ],
      };

      const result = createProductSchema.safeParse(validProduct);
      expect(result.success).toBe(true);
    });

    it('should reject product with empty name', () => {
      const invalidProduct = {
        name: '',
        coverArtId: 1,
        contributors: [],
      };

      const result = createProductSchema.safeParse(invalidProduct);
      expect(result.success).toBe(false);
    });

    it('should reject product without name', () => {
      const invalidProduct = {
        coverArtId: 1,
        contributors: [],
      };

      const result = createProductSchema.safeParse(invalidProduct);
      expect(result.success).toBe(false);
    });

    it('should reject product without coverArtId', () => {
      const invalidProduct = {
        name: 'Test Album',
        contributors: [],
      };

      const result = createProductSchema.safeParse(invalidProduct);
      expect(result.success).toBe(false);
    });
  });

  describe('updateProductSchema', () => {
    it('should validate a valid partial update', () => {
      const validUpdate = {
        name: 'Updated Album',
      };

      const result = updateProductSchema.safeParse(validUpdate);
      expect(result.success).toBe(true);
    });

    it('should validate an empty update object', () => {
      const validUpdate = {};

      const result = updateProductSchema.safeParse(validUpdate);
      expect(result.success).toBe(true);
    });

    it('should reject update with empty name', () => {
      const invalidUpdate = {
        name: '',
      };

      const result = updateProductSchema.safeParse(invalidUpdate);
      expect(result.success).toBe(false);
    });
  });

  describe('createArtistSchema', () => {
    it('should validate a valid artist', () => {
      const validArtist = {
        name: 'John Doe',
      };

      const result = createArtistSchema.safeParse(validArtist);
      expect(result.success).toBe(true);
    });

    it('should reject artist with empty name', () => {
      const invalidArtist = {
        name: '',
      };

      const result = createArtistSchema.safeParse(invalidArtist);
      expect(result.success).toBe(false);
    });

    it('should reject artist without name', () => {
      const invalidArtist = {};

      const result = createArtistSchema.safeParse(invalidArtist);
      expect(result.success).toBe(false);
    });
  });

  describe('loginSchema', () => {
    it('should validate valid login credentials', () => {
      const validLogin = {
        email: 'user@example.com',
        password: 'password123',
      };

      const result = loginSchema.safeParse(validLogin);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email format', () => {
      const invalidLogin = {
        email: 'not-an-email',
        password: 'password123',
      };

      const result = loginSchema.safeParse(invalidLogin);
      expect(result.success).toBe(false);
    });

    it('should reject empty password', () => {
      const invalidLogin = {
        email: 'user@example.com',
        password: '',
      };

      const result = loginSchema.safeParse(invalidLogin);
      expect(result.success).toBe(false);
    });

    it('should reject missing email', () => {
      const invalidLogin = {
        password: 'password123',
      };

      const result = loginSchema.safeParse(invalidLogin);
      expect(result.success).toBe(false);
    });
  });
});
