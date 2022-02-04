import { QueryRunner } from 'typeorm'

export class SeedDb1642089422202 {
  name = 'SeedDb1642089422202'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO tags (name) VALUES ('games'), ('coffee'), ('nestjs'), ('javascript'), ('development')`
    )

    await queryRunner.query(
      `INSERT INTO users (username, email, password) VALUES ('Кирилл', 'a@gmail.com', '$2a$10$DxO4uESCQoXrlBvB1qwWfOBSm7c1K4/UNxEtiRq0PxzQfWSuzj91m'), ('Михаил', 'b@gmail.com', '$2a$10$DxO4uESCQoXrlBvB1qwWfOBSm7c1K4/UNxEtiRq0PxzQfWSuzj91m'), ('Алия', 'c@gmail.com', '$2a$10$DxO4uESCQoXrlBvB1qwWfOBSm7c1K4/UNxEtiRq0PxzQfWSuzj91m')`
    )

    await queryRunner.query(
      `INSERT INTO articles (slug, title, description, body, "tagList", "authorId") VALUES ('first-article', 'First Article', 'first Article description', 'first article body', 'games,nesjs', 1), ('second-article', 'Second Article', 'second Article description', 'second article body', 'development,coffee', 2)`
    )
  }
}
