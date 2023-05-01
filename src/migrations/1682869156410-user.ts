import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class User1682869156410 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'email',
            type: 'varchar(255)',
            isNullable: false,
          },
          {
            name: 'password',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'profession',
            type: 'varchar(255)',
            isNullable: false,
          },
          {
            name: 'created_at',
            default: "'now()'",
            type: 'timestamp',
          },
          {
            name: 'updated_at',
            default: "'now()'",
            type: 'timestamp',
          },
          {
            name: 'is_deleted',
            type: 'boolean',
            default: false,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
