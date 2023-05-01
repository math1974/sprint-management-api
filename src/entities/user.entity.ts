import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, BeforeInsert } from 'typeorm';

import * as bcrypt from 'bcrypt';
import Profession from '@app/enum/profession.enum';

@Entity({
	name: 'users'
})
export default class User extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		type: 'varchar',
		length: 255,
		nullable: false
	})
	name: string;

	@Column({
		type: 'varchar',
		length: 255,
		nullable: false
	})
	email: string;

	@Column({
		type: 'varchar',
		length: 255,
		enum: Profession,
		nullable: false
	})
	profession: Profession;

	@Column({
		type: 'varchar',
		nullable: false
	})
	password: string;

	@Column({
		type: 'boolean',
		default: false,
		nullable: false
	})
	is_deleted: boolean;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	@BeforeInsert()
	beforeInsert(): void {
		this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8));
	}
}
