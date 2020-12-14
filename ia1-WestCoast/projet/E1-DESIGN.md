1 - Architecture globale :
Nous avons décidé d'utiliser une architecture 3-tiers:
  - une interface web pour le front-end
  - l'API pour le back-end
  - une base de données

![alt text](Architecture.PNG)
 
2 - Le modele de donnée stocké :
2 tables de données :
  - les aéroports, qui contiennent nom et code (ex : Paris, CDG)
  - les billets, qui contiennent code départ, code destination et un prix, sous la forme CDG-JFK 400
  - Le client qui a un nom et une liste de billets

![alt text](UML.PNG)
  
3 - La stack technique :
  - Application et data : html, css, jquery, php, MySQL
  - DevOps : github
