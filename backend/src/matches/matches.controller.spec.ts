import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';

const jwtServiceMock = {
  verifyAsync: jest.fn().mockResolvedValue({ sub: 'u1', jti: 's1' }),
};
const authServiceMock = {
  getSession: jest.fn().mockReturnValue({
    id: 's1',
    userId: 'u1',
    username: 'u1',
    createdAt: new Date(),
  }),
};

describe('MatchesController', () => {
  let controller: MatchesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchesController],
      providers: [
        MatchesService,
        { provide: JwtService, useValue: jwtServiceMock },
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compile();

    controller = module.get<MatchesController>(MatchesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
