import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany, OneToOne, JoinColumn } from 'typeorm';

import { BoardEntity, UserEntity } from '.';

@Entity({
	name: 'board_users'
})
export default class BoardUser extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		type: 'int',
		nullable: false
	})
	creator_id: number;

	@Column({
		type: 'int',
		nullable: false
	})
	user_id: number;

	@Column({
		type: 'int',
		nullable: false
	})
	board_id: number;

	@OneToOne(() => UserEntity, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'board_id' })
	board: BoardEntity;

	@OneToOne(() => UserEntity, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'user_id' })
	user: UserEntity;

	@OneToOne(() => UserEntity, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'creator_id' })
	creator: UserEntity;

	@OneToOne(() => UserEntity, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'destroyer_id' })
	destroyer: UserEntity;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	@Column({
		type: 'boolean',
		default: false,
		nullable: false
	})
	is_deleted: boolean;
}
