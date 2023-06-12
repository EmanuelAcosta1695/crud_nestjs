import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import {User} from 'src/users/user.entity'

// Muchas publicaciones le pueden pertenecer a un solo usuario
@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string
    
    @Column()
    content: string
    
    // guardar el id de ese author
    @Column()
    authorId: number


    @ManyToOne(() => User, user => user.posts)
    author: User
}