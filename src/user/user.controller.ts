import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';

import { UserService } from './user.service';
import { User } from './schemas/user-schema';
import { IUser } from './dto/user.inetrface';
import { UpdateUserDto } from './dto/update-user.dto';
import { ValidatorMongoIdPipe } from './pipes/validator-mongo-id.pipe';
import { ChangeUserRoleDto } from './dto/change-user-role.dto';
import { ChangeUserStatusDto } from './dto/change-user-status.dto';
import { UserRole } from '../decorators/user-role.decorator';
import { UserRoleEnum } from './constants/user-role-enum';
import { UserRoleGuard } from '../guards/user-role.guard';

@ApiTags('Users CRUD')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, type: [User] })
  @UserRole(UserRoleEnum.ADMIN)
  @UseGuards(UserRoleGuard)
  @Get('')
  getAllUsers(): Promise<IUser[]> {
    return this.userService.getUsers();
  }

  @ApiOperation({ summary: 'Get user by userId' })
  @ApiResponse({ status: 200, type: User })
  @UserRole(UserRoleEnum.ADMIN)
  @UseGuards(UserRoleGuard)
  @Get('/:id')
  getUser(@Param('id', ValidatorMongoIdPipe) id: string): Promise<IUser> {
    return this.userService.getUserById(id);
  }

  @ApiOperation({ summary: 'Update user by userId' })
  @ApiResponse({ status: 200, type: User })
  @UserRole(UserRoleEnum.USER, UserRoleEnum.ADMIN)
  @UseGuards(UserRoleGuard)
  @Put('/:id')
  updateUser(
    @Param('id', ValidatorMongoIdPipe) id: string,
    @Body() param: UpdateUserDto,
  ): Promise<IUser> {
    return this.userService.updateUserByProperty(id, param);
  }

  @ApiOperation({ summary: 'Change role of user by userId' })
  @ApiResponse({ status: 200, type: User })
  @UserRole(UserRoleEnum.ADMIN)
  @UseGuards(UserRoleGuard)
  @Put('role/:id')
  changeUserRole(
    @Param('id', ValidatorMongoIdPipe) id: string,
    @Body() param: ChangeUserRoleDto,
  ): Promise<IUser> {
    return this.userService.updateRoleByUserId(id, param);
  }

  @ApiOperation({ summary: 'Change status of user by userId' })
  @ApiResponse({ status: 200, type: User })
  @UserRole(UserRoleEnum.ADMIN)
  @UseGuards(UserRoleGuard)
  @Put('status/:id')
  changeUserStatus(
    @Param('id', ValidatorMongoIdPipe) id: string,
    @Body() param: ChangeUserStatusDto,
  ): Promise<IUser> {
    return this.userService.updateStatusByUserId(id, param);
  }

  @ApiOperation({ summary: 'Delete user by userId' })
  @ApiResponse({ status: 200, type: User })
  @UserRole(UserRoleEnum.ADMIN)
  @UseGuards(UserRoleGuard)
  @Delete(':id')
  DeleteUser(@Param('id', ValidatorMongoIdPipe) id: string): Promise<IUser> {
    return this.userService.removeUserById(id);
  }
}