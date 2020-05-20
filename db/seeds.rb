# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

category_1 = Category.new({name: 'C1'});
category_2 = Category.new({name: 'C2'});
category_3 = Category.new({name: 'C3'});
category_4 = Category.new({name: 'C4'});
category_5 = Category.new({name: 'C5'});

reward_1 = Reward.create({name: 'R1'});
reward_2 = Reward.create({name: 'R2'});
reward_3 = Reward.create({name: 'R3'});
reward_4 = Reward.create({name: 'R4'});
reward_5 = Reward.create({name: 'R5'});

category_1.rewards << reward_1

category_2.rewards << reward_2

category_3.rewards << reward_2
category_3.rewards << reward_4

category_4.rewards << reward_3

category_5.rewards << reward_5


category_1.save
category_2.save
category_3.save
category_4.save
category_5.save