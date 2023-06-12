import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {Repository} from 'typeorm'
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateProfileDto } from './dto/create-profile.dto';
import { Profile } from './profile.entity';


@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,

    @InjectRepository(Profile) private profileRepository: Repository<Profile>,

    ) {}


  async createUser(user: CreateUserDto) {
    // chequear que, antes de las operaciones de crear el usuario, si el user esta en la db
      const userFound = await this.userRepository.findOne({
      where: {
        username: user.username // donde el username == user.username
      }
    })

    if (userFound) {
      return new HttpException('User already exists', 400)
    }

    const newUser = this.userRepository.create(user)
    return this.userRepository.save(newUser) 
   }


  getUsers() {
    return this.userRepository.find()
  }



  async getUser(id: number) {
    const userFound = await this.userRepository.findOne({
      // busco la columna id con el id:id
      where: {
        id
      },
      relations: ['posts']
    });

    if (!userFound) {
      return new HttpException('User Not Found', HttpStatus.NOT_FOUND) // NOT_FOUND = 404 | otra forma de manejar los errores http
    }

    return userFound;
  }




  async deleteUser(id: number) {
    // no devuelve el objeto sino el resultado de cuantas filas se eliminaron
    // return this.userRepository.delete({id: id}) // busco en la columna id el id. puedo poner solo id
    const userFound = await this.userRepository.findOne({
      where : {
        id
      }
    }) // busco en la columna id el id. puedo poner solo id

    if (!userFound) {
      return new HttpException('User not found', HttpStatus.NOT_FOUND)
    }

    return this.userRepository.delete({ id });
  }



  async updateUser(id: number, user: UpdateUserDto) {
    // return this.userRepository.update({id: id}, user)

    const userFound = await this.userRepository.findOne({
      where : {
        id
      }
    });

    if (!userFound) {
      return new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // combina el segundo sobre el primero
    const updateUser = Object.assign(userFound, user);
    return this.userRepository.save(updateUser)

  }


  // ---------------------------------------------------------------------

  // crea profiles en la tabla Profile que se relaciona con la tabla de users
  async createProfile(id: number, profile: CreateProfileDto) {
    // primero busco el user
    const userFound = await this.userRepository.findOne({
      where : {
        id,
      },
    });

    // si no lo encontro, no se hace la relacion porque no puedo relacionar con user q no existe
    if (!userFound){
      
      return new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // de esta forma tengo un nuevo perfil creado. pero aun no se ha relacionado
    // 1 -crep el nuevo perfil con typeorm en la tabla profile
    const newProfile = this.profileRepository.create(profile)

    // añado el nuevo profile
    // 2- guardo el nuevo perfil en la tabla de profile y me retorna un id eso
    const savedProfile = await this.profileRepository.save(newProfile)

    // si bien estoy creado el nuevo perfil, no lo estoy relacionando con ningun usuario
    // aca lo relaciono
    // 3- ese id ahora se lo asigno al user encontrado, en su propiedad profile
    userFound.profile = savedProfile

    return this.userRepository.save(userFound)
  }

  
}

