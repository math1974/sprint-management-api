import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';

import { TaskEntity, UserEntity } from '.';

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

	@Column({
		type: 'int',
		nullable: false
	})
	creator_id: number;

	@OneToMany(() => TaskEntity, (task) => task.board)
	tasks: TaskEntity[];

	@OneToOne(() => UserEntity)
	@JoinColumn({ name: 'creator_id' })
	creator: UserEntity;

	@OneToOne(() => UserEntity)
	@JoinColumn({ name: 'destroyer_id' })
	destroyer: UserEntity;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}
