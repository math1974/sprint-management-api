import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class Boards1684623029673 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'boards',
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
						type: 'text',
						isNullable: false
					},
					{
						name: 'description',
						type: 'text',
						isNullable: true
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

		await queryRunner.createForeignKeys('boards', [
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
		await queryRunner.dropTable('boards');
	}
}
