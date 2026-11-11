// El Jefe menu — single source of truth for every menu page.
// Transcribed from the printed menu (12 pages). Edit prices and items here, then run `npm run build`.
// item(name, price, description, image?, options?) — image is a file in public/img without extension.

const item = (name, price, desc, img = '', opts = {}) => ({ name, price, desc, img, isNew: !!opts.isNew, tag: opts.tag || '' });
const NEW = { isNew: true };

export const restaurant = {
  name: 'El Jefe Authentic Mexican Cuisine',
  street: '524 Lincoln Way',
  city: 'Ames',
  region: 'IA',
  zip: '50010',
  phone: '(515) 232-2778',
  phoneHref: 'tel:+15152322778',
  email: 'hi@eljefeauthenticmexicancuisine.com',
  hours: 'Monday – Sunday · 11AM – 10PM',
  lunchHours: 'Lunch menu Mon – Fri · 11AM – 3PM',
  lat: 42.0226081,
  lon: -93.6181003,
  facebook: 'https://www.facebook.com/p/El-Jefe-Authentic-Mexican-Cuisine-61557054149528/',
  googleMaps: 'https://www.google.com/maps/search/?api=1&query=El+Jefe+Authentic+Mexican+Cuisine+524+Lincoln+Way+Ames+IA+50010',
  directions: 'https://www.google.com/maps/dir/?api=1&destination=524+Lincoln+Way%2C+Ames%2C+IA+50010',
  appleMaps: 'https://maps.apple.com/?daddr=524+Lincoln+Way,+Ames,+IA+50010',
  // Set this once the restaurant has an online ordering link (Toast, Square, ChowNow…). Empty = button hidden.
  orderOnlineUrl: ''
};

export const menuPages = [
  {
    slug: 'menu', path: '/menu/', tab: 'Starters', title: 'Starters', plate: 'plate',
    intro: 'Nachos, dips, soups and salads to share while you wait for the fajitas.',
    sections: [
      { id: 'appetizers', eyebrow: 'Entradas', title: 'Appetizers', items: [
        item('Nachos Rancheros', '$14.50', 'Fresh fried corn tortilla chips topped with steak, Mexican sausage, hot sauce, cheese dip, our special red sauce, guacamole, pico de gallo and sour cream.', 'nachos'),
        item('Nachos El Jefe', '$15.00', 'Our sizzling version of our famous meats. Choice of steak, chicken or shrimp fajitas on crispy tortilla chips, topped with lettuce, sour cream, guacamole and pico de gallo.', 'nachos-el-jefe', NEW),
        item('Nachos Supreme', '$12.50', 'Tortilla chips smothered with cheese sauce and your choice of seasoned ground beef or chicken, with pico de gallo, lettuce, guacamole and sour cream.'),
        item('Fresh Guacamole', '$11.50', 'Diced avocados, tomatoes, cilantro, onion, cheese and lime juice.', 'guacamole'),
        item('Quesadilla', '$10 / $14', 'Grilled flour tortilla stuffed with cheese, served with pico de gallo, sour cream and guacamole. Cheese only $10 · Chicken, steak or shrimp $14.', 'quesadilla')
      ]},
      { id: 'dips', eyebrow: 'Aderezos', title: 'Dips', items: [
        item('Spinach Dip', '$7.50', 'Spinach dip served with tortilla chips.'),
        item('Cheese Dip', '$7.00', 'Creamy queso served with complimentary tortilla chips.'),
        item('Guacamole Dip', '$7.00', 'Fresh guacamole served with complimentary tortilla chips.'),
        item('Texas Dip', '$12.00', 'Grilled shrimp, crab and scallops with cheese sauce.'),
        item('Chori Dip', '$10.00', 'Creamy queso sprinkled with chorizo. Served with complimentary tortilla chips.', 'chori-dip')
      ]},
      { id: 'soups', eyebrow: 'Sopas', title: 'Soups', items: [
        item('Chicken Tortilla Soup', '$16.00', 'Red tomato broth with zucchini, onion and tomatoes. Served with chicken, fried tortilla strips and pico de gallo.'),
        item('Caldo de Camarón', '$18.00', 'Red tomato broth with zucchini, onion and tomatoes, combined with shrimp.'),
        item('Caldo de Mariscos', '$20.00', 'Shrimp, octopus and seafood mix cooked in a light tomato-based broth. Served with bread.', 'caldo'),
        item('Caldo de Pescado', '$20.00', 'Red tomato broth with potato and cactus, combined with fish. Served with bread.', '', NEW)
      ]},
      { id: 'salads', eyebrow: 'Ensaladas', title: 'Salads', items: [
        item('Taco Salad Fajita', '$13.00', 'Crispy flour tortilla shell with lettuce, melted cheese sauce, sautéed peppers, onions, tomatoes and fajita chicken or steak, topped with pico de gallo, guacamole and sour cream.'),
        item('Shrimp Salad', '$14.00', 'Romaine topped with grilled shrimp, shredded cheese, red cabbage and tomato. Your choice of dressing.'),
        item('Taco Salad', '$12.75', 'Crispy flour tortilla shell with lettuce, pico de gallo, cheese, sour cream, guacamole and ground beef, shredded beef or chicken.'),
        item('Grilled Chicken Salad', '$14.00', 'Romaine with grilled chicken strips, shredded cheese, red cabbage, tomatoes, avocado and croutons. Your choice of dressing.'),
        item('Lettuce Wrap', '$14.00', 'Chicken, steak or shrimp wrapped in lettuce with red cabbage and pico de gallo. Served with black beans and chipotle cream sauce.', 'lettuce-wrap')
      ]}
    ]
  },
  {
    slug: 'lunch', path: '/menu/lunch/', tab: 'Lunch', title: 'Lunch', plate: 'plate',
    intro: 'Weekday lunch plates, $10 combinations and lunch burritos. Served Monday through Friday, 11AM to 3PM.',
    sections: [
      { id: 'lunch', eyebrow: 'Almuerzo · Mon–Fri 11AM–3PM', title: 'Lunch Favorites', note: 'Lunch is served Monday through Friday from 11:00 a.m. to 3:00 p.m.', items: [
        item('Fajitas', '$12 / $13', 'Your choice of meat grilled with onions, tomatoes and bell peppers on a sizzling platter, with rice, beans, lettuce, sour cream, pico de gallo and tortillas. Chicken $12 · Steak $13.', 'lunch-fajitas'),
        item('Chile Verde', '$13.00', 'Tender pulled pork cooked with green chili sauce. Served with rice, beans and tortillas.'),
        item('Tacos Supremos', '$12.00', 'Two crispy flour tacos with beef or chicken, lettuce, cheese, sour cream and tomatoes. Served with rice and beans.'),
        item('Huevos con Chorizo', '$13.00', 'Three scrambled eggs cooked with chorizo (Mexican sausage). Served with rice, refried beans and tortillas.'),
        item('Pollo Loco', '$14.00', 'Marinated grilled chicken topped with sautéed onions and cheese sauce. Served with rice, lettuce, guacamole, pico de gallo and tortillas.', 'pollo-loco'),
        item('Chori-Pollo', '$14.50', 'Marinated grilled chicken topped with chorizo and cheese sauce. Served with rice, lettuce, guacamole, pico de gallo and tortillas.', 'chori-pollo'),
        item('Fajita Quesadilla', '$12.00', 'A grilled tortilla stuffed with cheese and steak or chicken fajitas. Served with rice, beans, lettuce, sour cream and pico de gallo.'),
        item('Carne Asada', '$17.00', '8oz ribeye steak with rice, beans, lettuce, guacamole, pico de gallo, one fried jalapeño, sautéed onion and tortillas.', 'carne-asada'),
        item('Chile Colorado', '$13.00', 'Grilled sirloin steak cooked with a red chili sauce. Served with rice, beans and tortillas.'),
        item('Chimichanga', '$12.00', 'Flour tortilla stuffed with beef or chicken, fried golden and topped with cheese sauce. Served with rice, beans, lettuce, sour cream and pico de gallo.'),
        item('Chilaquiles Red or Green', '$15.00', 'Lightly fried corn tortillas in our homemade salsa and mozzarella, topped with two eggs, cilantro, onions and sour cream, with rice and beans.')
      ]},
      { id: 'lunch-combos', eyebrow: 'Combinaciones de almuerzo', title: 'Lunch Combinations', note: 'Any combination for $10, Monday through Friday, 11AM to 3PM.',
        choices: { title: 'Pick a number', price: '$10', list: [
          ['1. Chile relleno, taco, rice and a side of guacamole salad', '$10'], ['2. Beef burrito, rice and beans', '$10'],
          ['3. Enchilada, rice and beans', '$10'], ['4. Burrito, one taco and rice', '$10'],
          ['5. Two tacos and rice', '$10'], ['6. Two enchiladas and rice', '$10'],
          ['7. Burrito, tamal and rice', '$10'], ['8. Chile relleno, enchilada, rice and beans', '$10']
        ]}},
      { id: 'lunch-burritos', eyebrow: 'Almuerzo', title: 'Lunch Burritos', items: [
        item('Texas Burritos', '$12.50', 'Two flour tortillas stuffed with grilled steak and smothered with cheese sauce. Served with rice, lettuce, cheese and tomatoes.'),
        item('Meat & Potato Burrito', '$13.00', 'Steak, chicken or chorizo with potatoes, lettuce, white rice, whole pinto beans and sour cream. Smothered with cheese sauce.'),
        item('California Burrito', '$13.50', 'Rice, beans, lettuce, sour cream, guacamole, pico de gallo and chicken, pastor or steak. Topped with green chili sauce, cheese sauce and red sauce.', 'burrito'),
        item('Burrito Rojo', '$13.00', 'Shredded beef, chili rojo sauce, white rice and whole pinto beans. Smothered in chili rojo sauce and topped with queso fresco.'),
        item('Burrito Verde', '$13.00', 'Carnitas (slow-fried pork), chili verde sauce, white rice and whole pinto beans. Smothered in chili verde sauce and topped with queso fresco.', 'burrito-verde')
      ]}
    ]
  },
  {
    slug: 'chef', path: '/menu/chef-favorites/', tab: 'Chef & Chicken', title: 'Chef Favorites & Chicken', plate: 'plate',
    intro: 'Tortas, tacos, birria and stone-bowl molcajetes, plus our chicken platillos.',
    sections: [
      { id: 'chef', eyebrow: 'Favoritos del chef', title: 'Chef Favorites', items: [
        item('Torta', '$14.00', 'Mexican bread sandwich with steak, chicken, pastor, ham or salchicha, lettuce, avocado, pickled jalapeños, tomatoes, onions and mayo, with french fries.'),
        item('Torta Cubana', '$16.50', 'Grilled chicken, salchicha, ham, a sunny-side egg, pineapple, avocado, jalapeños, mozzarella and more on Mexican bread. With fries, a chile toreado and a cambray onion.'),
        item('Chile Verde', '$16.50', 'Tender pulled pork cooked with green chili sauce. Served with rice, beans and tortillas.'),
        item('Chile Colorado', '$17.00', 'Grilled chunks of sirloin steak cooked with red chili sauce. Served with rice, beans and tortillas.'),
        item('Carnitas', '$18.00', 'Slow-fried pork shoulder butt with rice, beans, lettuce, guacamole, pico de gallo, pickled jalapeños and tortillas.'),
        item('Tacos al Pastor', '$16.00', 'Three soft corn tortillas with marinated grilled pork, sweet onion and pineapple, topped with cilantro, onion and avocado. Small side of rice and beans.'),
        item('Steak Tacos', '$15.00', 'Three soft flour tortillas stuffed with chunks of grilled steak. Served with beans, pico de gallo and hot salsa.'),
        item('Tacos al Carbón', '$16.00', 'Three steak tacos marinated in our house salsa with queso fresco and pico de gallo. Served with rice, beans, lettuce and guacamole.'),
        item('Chimichangas', '$15.00', 'Shredded beef or chicken in flour tortillas, fried golden and smothered in cheese sauce. With rice, beans, lettuce, guacamole, pico de gallo and sour cream.'),
        item('Tacos de Carnitas', '$16.00', 'Three braised pork tacos with pico de gallo, avocado, cilantro and queso fresco. Served with pinto beans and tomatillo hot sauce.'),
        item('Flautas', '$15.00', 'Rolled fried tortillas filled with shredded chicken or beef, topped with queso fresco, sour cream, tomato and avocado on a bed of lettuce.'),
        item('Fried Taco Birria', '$16.00', 'Three corn tacos dipped in beef birria soup and fried with mozzarella, topped with cilantro and onions. With a small birria soup, rice and beans.'),
        item('Sopes', '$14.00', 'Three circles of fried masa with grilled chicken, steak or shrimp, lettuce, sour cream, queso fresco, avocado, tomato and beans.'),
        item('Chiles Rellenos', '$15.50', 'Two large poblano peppers stuffed with cheese and potato, chicken, steak or shrimp, topped with our special sauce. Served with rice and beans.'),
        item('La Taquiza', '$18.00', 'Four mixed-meat tacos with steak, chicken, onions, jalapeño, pineapple and cheese. With green onions, lime, hot sauce and a fried jalapeño.')
      ]},
      { id: 'molcajetes', eyebrow: 'En piedra', title: 'Molcajetes', note: 'Served in a traditional molcajete stone bowl with rice, beans, lettuce, pico de gallo, sour cream, guacamole and tortillas.', items: [
        item('Molcajete Alegre', '$33.00', 'Rib-eye steak, grilled chicken breast, grilled shrimp, chorizo, grilled onions, queso fresco and cactus with spicy house salsa.', 'molcajete-alegre'),
        item('Molcajete Seafood', '$34.00', 'Shrimp, scallops and tilapia grilled with mushrooms, squash, Mexican onions and nopales, in our special red sauce with spicy house salsa.'),
        item('Molcajete El Jefe', '$45.00', 'Whole fried tilapia, shrimp, scallops, mussels, crab and octopus with our special homemade seafood salsa.', 'molcajete-jefe', NEW)
      ]},
      { id: 'chicken', eyebrow: 'Platillos de pollo', title: 'Chicken', items: [
        item('Pollo Loco', '$15.00', 'Grilled chicken breast topped with sautéed onion and cheese sauce. Served with rice, lettuce, guacamole, pico de gallo and tortillas.', 'pollo-loco'),
        item('Chori-Pollo', '$17.00', 'Grilled chicken breast topped with chorizo and cheese sauce. Served with rice, lettuce, guacamole, cheese, pico de gallo and tortillas.', 'chori-pollo'),
        item('Chicken Rice', '$15.00', 'Grilled chicken over rice, topped with cheese sauce, with a side of tortillas.'),
        item('Chicken Primavera', '$15.00', 'Grilled chicken breast with mushrooms and onions under cheese sauce. With rice, black beans, lettuce, guacamole and sour cream.'),
        item('Chicken Chipotle', '$15.00', 'Grilled chicken with chipotle sauce. Served with romaine salad and rice.'),
        item('Pollo Hawaii', '$15.00', 'Grilled chicken with ham and bacon, topped with a pineapple ring and cheese sauce. Served with rice and romaine salad.'),
        item('Chicken Mole Poblano', '$16.00', 'Chicken breast topped with mole sauce. Served with rice, guacamole, salad and tortillas.'),
        item('Guadalajara Special', '$16.00', 'Grilled chicken and shrimp with onions, tomatoes and bell peppers over rice, topped with cheese sauce, with tortillas.'),
        item('Pollo Piña', '$16.00', 'Grilled chicken breast with pineapple, onions, tomato and peppers over rice, covered with cheese sauce. With romaine salad.', 'pollo-pina')
      ]}
    ]
  },
  {
    slug: 'plates', path: '/menu/steaks-fajitas/', tab: 'Steaks, Fajitas & Enchiladas', title: 'Steaks, Fajitas & Enchiladas', plate: 'plate',
    intro: 'Dinner combinations, ribeye and T-bone plates, sizzling fajitas and enchiladas.',
    sections: [
      { id: 'combos', eyebrow: 'Combinaciones de cena', title: 'Dinner Combinations', note: 'Your choice of two items, served with rice and beans.',
        choices: { title: 'Choose any two', price: '$12.50', list: [
          ['Favorite: Chile relleno', ''], ['Tacos: Beef (soft or hard shell) · Chicken (hard shell) · Bean (soft shell)', ''],
          ['Enchiladas: Beef · Cheese · Chicken', ''], ['Burritos: Beef · Chicken · Bean', ''],
          ['Quesadilla: Cheese · Chicken · Shredded beef', ''], ['Tamales: Chicken (green salsa) · Pork (red salsa) · Chicken with mole', '']
        ]}},
      { id: 'steaks', eyebrow: 'Las carnes', title: 'Steaks', items: [
        item('El Jefe Platter', '$18.00', 'Sliced steak, Mexican sausage, onions and mushrooms, all grilled and topped with cheese sauce. Served with rice, beans and tortillas.', '', NEW),
        item('Carne Asada', '$21.50', '8oz ribeye steak with rice, beans, lettuce, guacamole, pico de gallo, one fried jalapeño, sautéed onion and tortillas.', 'carne-asada'),
        item('Steak Ranchero', '$22.00', '12oz T-bone grilled to your liking and smothered in our special spicy sauce. With rice, beans, pico de gallo, guacamole and tortillas.', 'steak-ranchero'),
        item('Steak Para El Jefe', '$22.50', '8oz ribeye with a strip of grilled bacon-wrapped shrimp. With rice, beans, lettuce, guacamole, tomatoes and tortillas.'),
        item('El Muchacho Especial', '$31.00', '8oz ribeye, shrimp, corn, two cheese enchiladas, guacamole, a fried jalapeño, rice, beans, pico de gallo and tortillas.', 'muchacho'),
        item('El Regio', '$22.00', 'Grilled chicken, steak and shrimp with rice, beans, guacamole, pico de gallo, a fried jalapeño and tortillas.', 'el-regio'),
        item('Steak Jalisco', '$23.00', '12oz T-bone on a sizzling platter over cooked vegetables and cheese sauce. With rice, red sauce, beans, lettuce, pico, guacamole and tortillas.'),
        item('El Muchacho Steak', '$23.00', '12oz T-bone cooked to your preference, topped with grilled shrimp and vegetables. Served with rice, beans and tortillas.', '', NEW)
      ]},
      { id: 'fajitas', eyebrow: 'Al sartén', title: 'Fajitas', note: 'Ripe red tomatoes, fresh bell peppers and sweet onions, sautéed and served sizzling with rice, beans, lettuce, guacamole, sour cream and tortillas.',
        choices: { title: 'Build your own · choice of meat', price: 'from $15', list: [
          ['Grilled Chicken', '$16.00'], ['Steak', '$17.00'], ['Shrimp', '$19.00'], ['Shrimp & Chicken', '$19.00'],
          ['Steak & Shrimp', '$20.00'], ['Steak & Scallops', '$20.50'], ['Pork', '$16.00'], ['Vegetarian', '$15.00']
        ]},
        items: [
        item('Fajitas Texanas', '$20.00', 'Steak, chicken and shrimp.', 'fajitas'),
        item('Fajitas Hawaiianas', '$20.00', 'Shrimp, chicken, pineapple chunks and bacon.'),
        item('Fajitas Alegres', '$20.50', 'Steak, chicken, shrimp and chorizo.'),
        item('Fajitas Jalisco', '$19.00', 'Steak, chorizo and chicken, topped with queso.'),
        item('Fajitas del Mar', '$21.00', 'Grilled shrimp, tilapia and scallops over onions, bell peppers and pineapple.'),
        item('Fajitas Para El Jefe', '$21.00', 'Steak, chicken and shrimp with mushrooms and grilled onions, topped with mozzarella and pico de gallo.'),
        item('Fajita Bowl', '$15.50', 'Chicken or steak with grilled onions and peppers over rice, pinto beans, cilantro, tomatoes, broccoli, avocado, fresh cheese and sour cream.', 'fajita-bowl')
      ]},
      { id: 'enchiladas', eyebrow: 'Enchiladas', title: 'Enchiladas', items: [
        item('Potato Enchiladas', '$14.00', 'Three corn tortillas stuffed with potatoes, topped with red chili sauce and queso fresco. With black beans, romaine and tomatoes.'),
        item('Enchiladas Verdes', '$14.00', 'Three corn tortillas with beef, chicken or cheese, topped with green chili sauce and cheese. Served with rice and beans.'),
        item('Seafood Enchiladas', '$16.50', 'Shrimp, crab and scallops in three corn tortillas, topped with green chili sauce, cheese, sour cream and avocado. With rice and beans.'),
        item('Enchiladas Poblanas', '$14.00', 'One beef, one chicken, one refried bean and one cheese, with red enchilada sauce, lettuce, sour cream and tomato.'),
        item('Enchiladas Mole', '$16.00', 'Three cheese enchiladas topped with shredded pork and mole poblano sauce. With rice, lettuce, guacamole and tomatoes.'),
        item('Enchiladas Jalisco', '$15.00', 'Three chicken enchiladas topped with red sauce and cheese. With rice, lettuce, guacamole and pico de gallo.'),
        item('Enchiladas Mexicanas', '$14.25', 'One cheese, one beef and one chicken enchilada under three different sauces and sour cream. Served with rice and beans.')
      ]}
    ]
  },
  {
    slug: 'burritos', path: '/menu/burritos-quesadillas/', tab: 'Burritos & Quesadillas', title: 'Burritos & Quesadillas', plate: 'plate',
    intro: 'Big flour-tortilla favorites, smothered or bowled, plus quesadillas grilled to order.',
    sections: [
      { id: 'burritos', eyebrow: 'Los burritos', title: 'Burritos', items: [
        item('California Burrito', '$16.00', 'Rice, beans, lettuce, sour cream, guacamole, pico de gallo and chicken, pastor or steak, topped with green chili, cheese and red sauces.', 'burrito'),
        item('Burrito Bowl', '$17.00', 'White rice, romaine mix, Southwest-style corn, sour cream, queso fresco and hot sauce on the side, with chicken, steak or pastor.', 'burrito-bowl'),
        item('Fajita Burrito', '$15.00', 'Chicken or steak fajitas topped with red sauce, cheese, lettuce, sour cream, guacamole and pico de gallo. Served with rice and beans.'),
        item('Chipotle Burrito', '$15.00', 'Pulled pork or chicken in chipotle sauce with sautéed onions and mild peppers, topped with cheese sauce. With rice, lettuce and tomatoes.'),
        item('Texas Burrito', '$16.00', 'Two flour tortillas stuffed with steak and topped with cheese sauce. Served with rice, lettuce and tomatoes.'),
        item('Iris Burrito', '$16.00', 'Grilled chicken, mushrooms, cheese, beans, rice and hot sauce, smothered in cheese and enchilada sauce, with guacamole and sour cream.'),
        item('Burrito Mexicano', '$15.00', 'Tender pulled pork topped with cheese sauce. Served with rice, lettuce, sour cream and tomatoes.'),
        item('Meat & Potato Burrito', '$15.00', 'Steak, chicken or chorizo with potatoes, lettuce, white rice, whole pinto beans and sour cream. Smothered with cheese sauce.'),
        item('Happy Burrito', '$15.00', 'Ground beef or chicken topped with red sauce, cheese, lettuce, sour cream and tomatoes. Served with rice and beans.'),
        item('Burrito Gordo', '$16.00', 'A large flour tortilla stuffed with rice, beans, chicken and chorizo (Mexican sausage), topped with cheese sauce.')
      ]},
      { id: 'quesadillas', eyebrow: 'Quesadillas', title: 'Quesadillas', items: [
        item('Fajita Quesadilla', '$15.00', 'Grilled flour tortilla with cheese and chicken or steak fajitas. With rice, beans, lettuce, guacamole, pico de gallo and sour cream.', 'quesadilla'),
        item('Spinach Quesadilla', '$14.00', 'Spinach and cheese with chicken, steak or cheese only. With black beans, romaine, tomatoes and guacamole.'),
        item('Garden Quesadilla', '$15.00', 'Cheese, mushrooms and sautéed vegetables. With rice, beans, lettuce, guacamole, pico de gallo and sour cream.'),
        item('Seafood Quesadilla', '$15.50', 'Cheese, shrimp and crab. With rice, beans, lettuce, guacamole, pico de gallo and sour cream.'),
        item('California Quesadilla', '$15.00', 'Folded and grilled with cheese and grilled chicken, steak, pastor or shrimp. With pico, guacamole, sour cream, rice and beans.'),
        item('Quesadilla El Jefe', '$15.50', 'Grilled steak or chicken with melted cheese, topped with cheese sauce. With rice, lettuce, tomato and sour cream.')
      ]}
    ]
  },
  {
    slug: 'seafood', path: '/menu/seafood-desserts/', tab: 'Seafood & Desserts', title: 'Seafood & Desserts', plate: 'plate',
    intro: 'Aguachile, ceviche, shrimp every way and whole fried mojarra. Save room for fried ice cream.',
    rawAdvisory: true,
    sections: [
      { id: 'seafood', eyebrow: 'Del mar', title: 'Seafood', items: [
        item('Aguachile Rojo or Verde', '$25.00', '24 shrimp cooked in lime juice with red or green sauce, red onion and cucumber, topped with sliced avocado. Served with three tostadas.', 'aguachile'),
        item('Coctel de Camarón', '$18.00', 'Refreshing shrimp cocktail with pico de gallo and diced avocado. Served with saltine crackers.', 'coctel'),
        item('Ceviche Flights', '$19.50', 'Shrimp, fish and octopus ceviche.', 'ceviche-flight', NEW),
        item('Fried Mojarra', '$20.00', 'Whole fried tilapia served with rice and fresh salad.', 'mojarra'),
        item('Fish Tacos', '$16.00', 'Two tilapia tacos with red cabbage, tomatoes and cheese. Served with white rice and black beans.', '', { tag: 'GRILLED OR FRIED' }),
        item('Shrimp Tacos', '$16.00', 'Two shrimp tacos with onions and bell peppers, topped with cilantro and queso fresco. With white rice and black beans.', '', { tag: 'GRILLED OR FRIED' }),
        item('Camarones a la Diabla', '$19.00', 'Sautéed shrimp with pico de gallo and a very spicy red sauce. Served with rice, beans and tortillas.'),
        item('Camarones Crema', '$19.00', 'Shrimp cooked with sour cream, cheese sauce and mushrooms. Served with romaine salad and black beans.'),
        item('Camarones al Mojo de Ajo', '$19.00', 'Shrimp sautéed with garlic, onion, mushrooms and cilantro, topped with cheese sauce. With rice, beans and tortillas.'),
        item('Shrimp Chipotle', '$17.50', 'Grilled shrimp cooked with onions, tomatoes and bell peppers. Served with rice and romaine salad.'),
        item('Burrito de Mar', '$17.00', 'Shrimp, tilapia and crab in a flour tortilla, smothered in cheese sauce. With rice, lettuce, guacamole and pico de gallo.'),
        item('Camarones Corajudos', '$23.00', 'Whole shrimp sautéed in fresh lime juice with our special sauce. Served with cucumber slices.'),
        item('Garden Shrimp', '$18.00', 'Grilled shrimp with onions, tomatoes and broccoli. Served with rice and romaine salad.'),
        item('Seafood Chimichanga', '$16.00', 'Shrimp and crab in a flour tortilla, fried golden and smothered in cheese sauce. With rice, beans, lettuce, sour cream, pico and guacamole.'),
        item('Tilapia a la Plancha', '$17.00', '7–9oz tilapia fillet grilled over sautéed onions, tomatoes and bell peppers. Served with rice and a side salad.'),
        item('Ceviche ¡Ay Amá!', '$19.25', 'Citrus-marinated shrimp with diced tomatoes, cucumber, onion and cilantro, topped with avocado. Served with tostadas.'),
        item('Oysters', '$15 / $25', 'On the half shell. Half dozen $15 · Dozen $25.')
      ]},
      { id: 'desserts', eyebrow: 'Los postres', title: 'Desserts & Sides', items: [
        item('Fried Ice Cream', '$7.00', 'Crispy-coated ice cream with chocolate and caramel.', 'fried-ice-cream'),
        item('Churros', '$8.00', 'Cinnamon-sugar churros with ice cream.', 'churros'),
        item('Sopapilla with Ice Cream', '$7.00', 'Fried pastry with ice cream, chocolate and caramel.', 'sopapilla'),
        item('Flan', '$7.00', 'Classic Mexican caramel custard.', 'flan'),
        item('Chocoflan', '$7.00', 'Chocolate cake layered with flan.', 'chocoflan'),
        item('Pastel 3 Leches', '$7.00', 'Three-milk sponge cake.', 'tres-leches'),
        item('Cheesecake', '$7.00', 'Classic cheesecake with fresh strawberries.', 'cheesecake'),
        item('Grilled Mexican Street Corn', '$7.00', 'Esquites-style corn with lime.', 'street-corn'),
        item('Corn on the Cob (Elote Entero)', '$7.00', 'Whole grilled elote with chile and lime.', 'elote')
      ]}
    ]
  },
  {
    slug: 'bar', path: '/bar/', tab: 'Margaritas', title: 'Margaritas', plate: 'navy', bar: true, eyebrow: 'La Cantina',
    intro: 'Shaken at your table, frozen, top shelf or with boba. Tragos, música y alegría.',
    sections: [
      { id: 'specials', eyebrow: 'Favoritos del bar', title: 'Bar Specials', items: [
        item('Boba Margarita', '$15.00', 'For her or for him. Mango, strawberry, peach, kiwi, blueberry or pomegranate.', 'boba'),
        item('Top Shelf Mojito', '$15.00', 'Fresh muddled mint and fruit, rum and agave. Strawberry, peach, watermelon, blackberry, kiwi, coconut, pineapple or cucumber + kiwi.', 'mojito'),
        item('Mexican Candy Shots', '$24.00', 'Pick 4 shots and flavors: mango, watermelon, strawberry, plain, peach, Liquid Cocaine, raspberry, tamarind.', 'candy-shots'),
        item('El Muchacho Flight', '$24.00', 'Pick 4 margaritas and flavors: mango, watermelon, strawberry, plain, peach, Liquid Cocaine, raspberry, tamarind.', 'flight')
      ]},
      { id: 'signature', eyebrow: 'Margaritas', title: 'Signature Margaritas', items: [
        item('El Jefe Tower Margarita', '$75.00', 'Over 128oz! Great for parties: a whole tower of our house margarita.', 'tower'),
        item('Spicy Mango Tajín Margarita', '$14.00', 'A jumbo frozen spicy mango margarita rimmed with chamoy and tajín.', 'mango-margarita'),
        item('Octopus Margarita', '$13.00', 'Frozen lime margarita with sangria.'),
        item('Purple Gecko Margarita', '$14.00', 'Gold tequila, El Muchacho mix, cranberry juice, blue curaçao and grenadine.'),
        item('Piña Rita', '$15.00', 'Tequila blanco, fresh lime juice, pineapple and El Muchacho mix.'),
        item('Pomegranate Margarita', '$12.00', 'Pomegranate juice, tequila, triple sec and lime juice.'),
        item('Baby Mango Margarita', '$14.00', 'Gold tequila, fresh lime, fresh mango, El Muchacho mix, cranberry juice, blue curaçao and grenadine.')
      ]},
      { id: 'classics', eyebrow: 'Margaritas clásicas', title: 'Classic Margaritas', items: [
        item('Original Margarita', '$14.00', 'El Jimador Reposado, orange liqueur, triple sec, fresh lime and orange juice. Poured tableside in a shaker.', 'original-margarita'),
        item('House Margarita', '$8.50', 'Gold tequila, triple sec and house margarita mix.', 'house-margarita'),
        item('Blue Margarita', '$11.00', 'House margarita mix, gold tequila, triple sec and curaçao liqueur.', 'blue-margarita'),
        item('Frozen Margarita', '$9.50', 'Our house recipe with strawberry, mango, peach, watermelon or raspberry.'),
        item('Oasis Margarita', '$12.00', 'Triple-layered frozen margarita: strawberry margarita, piña colada and melon liqueur.'),
        item('Coronarita', '$14.00', 'A jumbo on-the-rocks or frozen margarita with an upside-down Coronita inside.')
      ]},
      { id: 'top-shelf', eyebrow: 'Hand crafted', title: 'Top Shelf Margaritas', items: [
        item('Top Shelf Margarita', '$16.00', 'The smoothest yet strongest we offer: freshly squeezed lime and Patrón Silver.', 'top-shelf'),
        item('Watermelon Margarita', '$15.00', 'Fresh muddled watermelon, squeezed fruit and tequila.', 'watermelon-marg'),
        item('Blood Orange Margarita', '$15.00', 'Freshly squeezed blood orange, lime and tequila.', 'blood-orange'),
        item('Blackberry Mint Margarita', '$15.00', 'Muddled fresh blackberries and mint, squeezed fruit and tequila.'),
        item('Raspberry Mint Margarita', '$15.00', 'Muddled fresh raspberries and mint, squeezed fruit and tequila.'),
        item('Fresh Strawberry Margarita', '$15.00', 'Muddled fresh strawberries and gold tequila.'),
        item('Cranberry Margarita', '$15.00', 'Strong yet smooth: cranberry juice, lemon, lime, orange and 1800 tequila.'),
        item('Jalapeño Margarita', '$15.00', 'Fresh muddled jalapeños, squeezed fruit and tequila.'),
        item('Cucumber Margarita', '$15.00', 'Muddled fresh cucumber, squeezed fruit and gold tequila.'),
        item('Piña Margarita', '$16.00', 'Muddled fresh pineapple, squeezed fruit and tequila.'),
        item('Skinny Margarita', '$15.00', 'Lower calorie, no sugar added: fresh lime, lemon, orange, club soda and top shelf tequila.'),
        item('Paloma', '$13.00', 'Fresh grapefruit and tequila.'),
        item('Cazuela Jalisco', '$14.50', 'Tequila blanco, grapefruit, orange and lemon.', '', { tag: 'COCKTAIL' })
      ]},
      { id: 'shakers', eyebrow: 'Poured tableside', title: 'El Jefe Shakers', note: 'Freshly squeezed lime, orange juice, Gran Gala, triple sec, El Muchacho mix and tequila, poured tableside in a shaker.', items: [
        item('The Original Shaker Margarita', '$14.00', 'Our classic shaker recipe, poured at your table.', 'shakers'),
        item('La Fresa Shaker', '$15.00', ''),
        item('The Blue', '$15.00', ''),
        item('The Watermelon Basil', '$15.00', ''),
        item('La Hawaiana', '$15.00', ''),
        item('Smoky Blackberry', '$15.00', ''),
        item('The Mango Shaker', '$15.00', '')
      ]}
    ]
  },
  {
    slug: 'drinks', path: '/bar/drinks/', tab: 'Beer, Micheladas & More', title: 'Beer, Micheladas & More', plate: 'navy', bar: true, eyebrow: 'La Cantina',
    intro: 'Micheladas made from scratch, ice-cold Mexican beer, cocktails, wine and aguas frescas.',
    sections: [
      { id: 'micheladas', eyebrow: '¡Que no falte la miche!', title: 'Micheladas', items: [
        item('La Original', '$9.99', 'Your choice of beer mixed with our made-from-scratch michelada mix!', 'michelada'),
        item('Miche Back to Life', '$25.00', 'Michelada garnished with six shrimp, served with three oysters topped with pico de gallo, avocado and one ceviche tostada.', 'miche'),
        item('Cubetazo', '$26.99', 'Six beers of your choice in an ice-cold bucket!', 'cubetazo')
      ]},
      { id: 'beer', eyebrow: 'Cervezas', title: 'Beer', items: [
        item('Cervezas Mexicanas', '$5.25', 'Dos Equis Ámbar & Lager, Modelo Especial, Negra Modelo, Corona, Corona Light, Corona Familiar, Corona Premier, Tecate, Victoria, Pacífico, Sol.', 'beer-mx'),
        item('Cervezas Domésticas', '$5.00', 'Bud Light, Budweiser, Miller Lite, Coors Light, Michelob Ultra, Busch Light, Blue Moon.', 'beer-dom'),
        item('Draft Beer', '$5 / $8 / $12', 'Small, medium or large. Modelo Especial, Pacífico, Bud Light, Dos Equis Lager, Blue Moon, Mango Cart.', '', { tag: 'DE BARRIL' }),
        item('Non-Alcoholic Beer', '$4.00', 'Michelob Ultra, Corona, Dos Equis Zero, Heineken.', 'na-beer')
      ]},
      { id: 'mixed', eyebrow: 'Mixed drinks', title: 'Cocktails', items: [
        item('Piña Colada', '$10.00', 'Rum and pineapple.', 'pina-colada'),
        item('Strawberry Daiquiri', '$8.50', 'Strawberries, fresh lime, syrup and rum.', 'pina-colada'),
        item('Bloody Mary', '$8.50', 'Vodka, tomato juice and spices.'),
        item('Tequila Sunrise', '$8.50', 'Tequila, orange juice and grenadine.'),
        item('Tequila Moscow Mule', '$12.00', 'Made with vodka, ginger beer and fresh lime.')
      ]},
      { id: 'wine', eyebrow: 'Vino y licores', title: 'Wine & Liquor', note: 'Other brands may be available — ask your server.', items: [
        item('Wine by the Glass', '$7.50', 'Copper Ridge: Chardonnay, Riesling, White Zinfandel, Cabernet Sauvignon.'),
        item('Whiskey', 'Ask', 'Crown Royal, Jack Daniel’s, Wild Turkey, Johnnie Walker Red Label, Jim Beam.'),
        item('Rum', 'Ask', 'Captain Morgan, Bacardí.'),
        item('Vodka', 'Ask', 'Absolut.'),
        item('Gin', 'Ask', 'Tanqueray.'),
        item('Brandy', 'Ask', 'Presidente.')
      ]},
      { id: 'soft', eyebrow: 'Bebidas no alcohólicas', title: 'Soft Drinks', items: [
        item('Aguas Frescas', '$5.50', 'Piña (pineapple), horchata (rice water) or jamaica.', 'agua-fresca', { tag: 'NO REFILLS' }),
        item('Mexican Coca-Cola', '$4.75', 'Glass bottle.', 'coca-cola'),
        item('Jarritos', '$3.50', 'Orange, lime, mango, grapefruit, fruit punch, strawberry, pineapple, sangria, guava.', 'jarritos'),
        item('Fresh Brewed Tea', '$2.99', 'Unsweetened regular, raspberry or peach.', 'tea'),
        item('Soft Drinks', '$3.25', 'Coca-Cola, Diet Coke, Mr Pibb, Fanta, Coke Zero, Cherry Coke, Sprite, Lemonade, Root Beer, Milk, Apple juice.'),
        item('Coffee · Café de Olla', '$3.00', 'Coffee $3 · Café de Olla $3.')
      ]}
    ]
  }
];

// Home page "Fan favorites" row — names must match items above.
export const featured = [
  { name: 'Fajitas Texanas', sub: 'Steak, chicken & shrimp on a sizzling platter', page: 'plates', anchor: 'fajitas' },
  { name: 'El Muchacho Especial', sub: '8oz ribeye, shrimp, corn & two cheese enchiladas', page: 'plates', anchor: 'steaks' },
  { name: 'Pollo Piña', sub: 'Grilled chicken, pineapple & peppers under cheese sauce', page: 'chef', anchor: 'chicken' },
  { name: 'Nachos Rancheros', sub: 'Steak, Mexican sausage, cheese dip & our red sauce', page: 'menu', anchor: 'appetizers' },
  { name: 'Aguachile Rojo or Verde', sub: '24 lime-cured shrimp, cucumber, red onion, avocado', page: 'seafood', anchor: 'seafood' },
  { name: 'Molcajete El Jefe', sub: 'Whole fried tilapia, shrimp, crab & octopus', page: 'chef', anchor: 'molcajetes' }
];
