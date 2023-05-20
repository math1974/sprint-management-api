import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany, OneToOne, JoinColumn } from 'typeorm';

import { UserEntity } from '.';

@Entity({
	name: 'boards'
})
export default class Board extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		type: 'text',
		nullable: false
	})
	title: string;

	@Column({
		type: 'text',
		nullable: true
	})
	description: string;

	@Column({
		type: 'boolean',
		default: false,
		nullable: false
	})
	is_deleted: boolean;

	@OneToOne(() => UserEntity)
	@JoinColumn({ name: 'creator_id' })
	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}
