import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class BoardUsers1685229715517 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'board_users',
				columns: [
					{
						name: 'id',
						type: 'integer',
						isPrimary: true,
						isGenerated: true,
						generationStrategy: 'increment'
					},
					{
						name: 'user_id',
						type: 'int',
						isNullable: false
					},
					{
						name: 'is_admin',
						type: 'boolean',
						isNullable: false,
						default: false
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

		await queryRunner.createForeignKeys('board_users', [
			new TableForeignKey({
				columnNames: ['user_id'],
				referencedColumnNames: ['id'],
				referencedTableName: 'users'
			}),
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
		await queryRunner.dropTable('board_users');
	}
}
