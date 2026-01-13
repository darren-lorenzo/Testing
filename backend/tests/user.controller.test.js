const userController = require('../Api/Controllers/user.controler');

// Mock global.Users
const mockUser = {
  findOne: jest.fn(),
  create: jest.fn(),
  findAll: jest.fn(),
  findByPk: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
};

global.Users = mockUser;

describe('User Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user if not exists', async () => {
      req.body = { name: 'Test User' };
      mockUser.findOne.mockResolvedValue(null);
      mockUser.create.mockResolvedValue(req.body);

      await userController.createUser(req, res);

      expect(mockUser.findOne).toHaveBeenCalledWith({ where: { name: 'Test User' } });
      expect(mockUser.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(req.body);
    });

    it('should return 400 if user already exists', async () => {
      req.body = { name: 'Test User' };
      mockUser.findOne.mockResolvedValue({ name: 'Test User' });

      await userController.createUser(req, res);

      expect(mockUser.findOne).toHaveBeenCalledWith({ where: { name: 'Test User' } });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "already exists" });
    });

    it('should return 500 on error', async () => {
      req.body = { name: 'Test User' };
      mockUser.findOne.mockRejectedValue(new Error('DB Error'));

      await userController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error creating User' });
    });
  });

  describe('getAllUser', () => {
    it('should return all users', async () => {
      const users = [{ name: 'User 1' }, { name: 'User 2' }];
      mockUser.findAll.mockResolvedValue(users);

      await userController.getAllUser(req, res);

      expect(mockUser.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(users);
    });

    it('should return 500 on error', async () => {
      mockUser.findAll.mockRejectedValue(new Error('DB Error'));

      await userController.getAllUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error fetching User' });
    });
  });

  describe('getUserById', () => {
    it('should return user by id', async () => {
      req.params.id = 1;
      const user = { id: 1, name: 'User 1' };
      mockUser.findByPk.mockResolvedValue(user);

      await userController.getUserById(req, res);

      expect(mockUser.findByPk).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(user);
    });

    it('should return 500 on error', async () => {
      req.params.id = 1;
      mockUser.findByPk.mockRejectedValue(new Error('DB Error'));

      await userController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error founding User' });
    });
  });

  describe('UpdateUser', () => {
    it('should update user if found', async () => {
      req.params.id = 1;
      req.body = { name: 'Updated User' };
      const user = { 
          id: 1, 
          name: 'User 1', 
          update: jest.fn().mockResolvedValue(true) 
      };
      mockUser.findByPk.mockResolvedValue(user);

      await userController.UpdateUser(req, res);

      expect(mockUser.findByPk).toHaveBeenCalledWith(1);
      expect(user.update).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'User updated successfully', user });
    });

    it('should return 404 if user not found', async () => {
      req.params.id = 1;
      mockUser.findByPk.mockResolvedValue(null);

      await userController.UpdateUser(req, res);

      expect(mockUser.findByPk).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should return 500 on error', async () => {
      req.params.id = 1;
      mockUser.findByPk.mockRejectedValue(new Error('DB Error'));

      await userController.UpdateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error updating user', error: 'DB Error' });
    });
  });

  describe('deleteUser', () => {
    it('should delete user if found', async () => {
      req.params.id = 1;
      const user = { 
          id: 1, 
          name: 'User 1', 
          destroy: jest.fn().mockResolvedValue(true) 
      };
      mockUser.findByPk.mockResolvedValue(user);

      await userController.deleteUser(req, res);

      expect(mockUser.findByPk).toHaveBeenCalledWith(1);
      expect(user.destroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Utilisateur supprimé avec succès" });
    });

    it('should return 404 if user not found', async () => {
      req.params.id = 1;
      mockUser.findByPk.mockResolvedValue(null);

      await userController.deleteUser(req, res);

      expect(mockUser.findByPk).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Utilisateur non trouvé" });
    });

    it('should return 500 on error', async () => {
      req.params.id = 1;
      mockUser.findByPk.mockRejectedValue(new Error('DB Error'));

      await userController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error deleting User' });
    });
  });
});
