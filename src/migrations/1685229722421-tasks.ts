import { StatusEnum } from '@app/enum';
import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class Tasks1685229722421 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'tasks',
				columns: [
					{
						name: 'id',
						type: 'integer',
						isPrimary: true,
						isGenerated: true,
						generationStrategy: 'increment'
					},
					{
						name: 'title',
						type: 'varchar(255)',
						isNullable: false
					},
					{
						name: 'content',
						type: 'TEXT',
						isNullable: true,
						default: null
					},
					{
						name: 'status',
						type: 'enum',
						enum: [StatusEnum.TO_DO, StatusEnum.SKIPPED, StatusEnum.RELEASED, StatusEnum.DONE, StatusEnum.DOING],
						default: `'TO_DO'`,
						isNullable: false
					},
					{
						name: 'board_id',
						type: 'int',
						isNullable: false
					},
					{
						name: 'creator_id',
						type: 'int',
						isNullable: false
					},
					{
						name: 'destroyer_id',
						type: 'int',
						isNullable: true,
						default: null
					},
					{
						name: 'created_at',
						default: "'now()'",
						type: 'timestamp'
					},
					{
						name: 'updated_at',
						default: "'now()'",
						type: 'timestamp'
					},
					{
						name: 'is_deleted',
						type: 'boolean',
						default: false
					}
				]
			})
		);

		await queryRunner.createForeignKeys('tasks', [
			new TableForeignKey({
				columnNames: ['board_id'],
				referencedColumnNames: ['id'],
				referencedTableName: 'boards'
			}),
			new TableForeignKey({
				columnNames: ['creator_id'],
				referencedColumnNames: ['id'],
				referencedTableName: 'users'
			}),
			new TableForeignKey({
				columnNames: ['destroyer_id'],
				referencedColumnNames: ['id'],
				referencedTableName: 'users'
			})
		]);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable('tasks');
	}
}
