import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';

import { BoardEntity, UserEntity } from '.';
import { StatusEnum } from '@app/enum';

@Entity({
	name: 'tasks'
})
export default class Task extends BaseEntity {
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
	content: string;

	@Column({
		type: 'enum',
		nullable: false,
		default: StatusEnum.TO_DO,
		enum: StatusEnum
	})
	status: StatusEnum;

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

	@Column({
		type: 'int',
		nullable: false
	})
	board_id: number;

	@Column({
		type: 'int',
		nullable: true,
		default: null
	})
	destroyer_id: number;

	@OneToOne(() => UserEntity)
	@JoinColumn({ name: 'creator_id' })
	creator: UserEntity;

	@OneToOne(() => BoardEntity)
	@JoinColumn({ name: 'board_id' })
	board: BoardEntity;

	@OneToOne(() => UserEntity)
	@JoinColumn({ name: 'destroyer_id' })
	destroyer: UserEntity;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}
