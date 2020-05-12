# **Project Phase 2 - Analyzing Tweets**
## **Principles of Big Data Management \(CS 5540\)**
----------------
>## **Authors**: 
>- ## **Jonathan Wolfe**
>- ## **Rod Skoglund**
>### Date: April 25, 2020
----------------


# **Table Of Contents**
1. [Design](#Design)
2. [Libraries](#Libraries)
3. [Queries](#Queries)
4. [Visualizations](#Visualizations)
5. [Code](#Code)
6. [Demo and Setup](#Demo-and-Setup)
7. [Work Assignments](#Work-Assignments)
8. [References](#References)
----------------

# Design
### The design involved several steps to develop this analysis.
  1. Developed Java script to pull Tweet information and extract Hashtags and URLS
      * Captured 250k tweets containing #coronavirus and filtered to only include tweets in english
      * It used Java library, twitter4j-4.0.7, to access the Twitter API
      * Saved the collected tweets into files with each tweet JSON per line
      * All files were limited to approximately 64MB size by writting a new file if it may exceed the size
  2. Developed and implemented queries to provide data for visualations using java and accessing the spark library
  3. Hosted a jetty REST API server in the application utilizing Spark to run queries
  4. Developed a connection to the REST API through an Ionic application developed using Angular
  5. Used D3 to create visualations including
  6. Docker was utilized to containerize the REST API server and Ionic web application server
      
---
# Libraries
We used numerous libraries to collect, analyze and display the data:
* twitter4j-4.0.7
* Appache Spark 2.4.5
* Spark SQL 2.4.5
* jetty 9.4.28.v20200408
* Gson 2.8.6
* Angular 8.2.14
* Ionic 5.0.0
* D3 5.4.0
* D3-Cloud 1.2.5
* rxjs 6.5.1
* topojson 3.0.2
* topojson-client 3.1.0
* D3-svg-legend 2.25.6
* Docker
---

# Queries
### Here are the queries we used to get and analyze the data:
1. Bubble Chart Data - a hashtag count query is defined to capture the number of times a tweet mentions each Hashtag. We limited the query to only return the top 200 results. 
2. Influencers - the Influencers query will capture tweets by users with the most followers. The query is ordered by the number of followers and we limit the data to users of the top 50 follower counts. 
3. Top Hashtags Overall - This query is used to capture the top ten Hashtags based on the number of tweets that reference the Hashtag.
4. Bots Data - made up from multiple queries. The essential data is the time the user account was created(user.created_at), the time that the tweet was created(created_at) and the amount of status updates: tweets, retweets and replies; that the user has made since creating the account(user.statuses_count). The first query is null checks on "user.statuses_count", "user.created_at" and "created_at". Next, the time difference between "user.created_at" and "created_at" are used to find the amount of days the account has existed. Then "statuses_count" is divided by the time the account has existed to give the average amount of tweets per day. This data is used to  count the number of users with more than 50 tweets per day, which is a good likelihood of being a bot. Then this set of bot tweets were divided into tweets, retweets and replies and counted to better understand the activities of bots.
5. Coronavirus tweet, retweet and response freqencies - This query simply returns the amounts of tweets, retweets and replies for all tweets in the dataset.
6. Coronavirus tweets grouped by country - This query first filters tweets that have a reported country, then groups these contries and formulates an aggregate count for each country.
7. Coronavirus tweet GPS coordinates - this query uses either the tweet latitude and logitude or if the tweet GPS is disabled the latitue and longitude of an edge of the user's reported place of living to understand where most of the tweets are originating. First the tweets with GPS enabled are collected. Then the remaining tweets with a home location are collected and an edge of the home area is extracted. Next, the latitudes and logitudes of these two sets are unioned. Finally, the latitude and longitude are divided into thier own columns. 
8. Top 10 hastags over time - These sets of queries determine the top ten hashtags for each hour over the time period in the data set and the amount of times each hashtag was used. The first step was to find the time period for the data set while also removing the times with very few tweets during that hour. Then the tweets for each hour were collected and grouped by hashtag and a count of each was determined and sorted by count. The top 11 tweets were collected and hashtags that were converted to lower-case containing #coronavirus were omitted from the list because it was selected for to be part of the data set. 
9. Most retweeted tweet of corona with follower and group count over time - these sets of queries collects the most retweeted tweet for each hour during the time of the dataset and the amount of followers that follow the user and the count of groups the user belongs. The first step was to find the time period that the tweets occurred while also removing tweets of periods with very few tweets. Then the tweet with the most retweets for each hour was found and the retweet count in 1000s, follower count in 100s and groups count were determined.
10. News agency influences - this query identifies the users that mention news as part of their description and shows their activity. The first part of this set of queries was to convert the descriptions to lower can then filter all descriptions that contain news in some form in the description. Next, the activities of these accounts; tweets, retweets and replies; were determined.

---

# Visualizations
### Our analysis included a sample of 500k to 2.3 million coronavirus related tweets. 
The goal was to perform analyses over all 2.3 million tweets, however some queries are really slow and could not be performed on 2.3 million tweets or the chart became too busy to be read where fewer tweets showed better.

## Word Cloud of Usernames with Most Followers of 2.3 mil tweets
![Word Cloud](https://github.com/JAWolfe04/CS5540-Big-Data-Project/blob/master/Screenshots/Word%20Cloud_2mil.png)

## Coronavirus Hashtag Bubble Chart of 500k tweets
Each bubble is a different corona virus Hashtag with the number of tweets associated with that Hashtag.  
![Bubble Chart](https://github.com/JAWolfe04/CS5540-Big-Data-Project/blob/master/Screenshots/Bubble%20Chart.png)

## Coronavirus Top 10 Hashtag Bar Chart of 500k tweets
This only shows Hashtags with more than 10 tweets.  
![Top Hashtags Bar Graph](https://github.com/JAWolfe04/CS5540-Big-Data-Project/blob/master/Screenshots/Hashtag%20Bar%20Graph.png)

## World Countries Map of 2.3 mil Coronavirus Tweets
![Countries Map](https://github.com/JAWolfe04/CS5540-Big-Data-Project/blob/master/Screenshots/Choropleth%20Map_2mil.png)

## Donut Charts of Bot Frequencies and Activities of 500k tweets
![Bot Charts](https://github.com/JAWolfe04/CS5540-Big-Data-Project/blob/master/Screenshots/Bot_Activity.png)

## Pie Chart of User Tweet Activity of 2.3mil tweets
![Tweet Pie Chart](https://github.com/JAWolfe04/CS5540-Big-Data-Project/blob/master/Screenshots/Tweet%20Pie%20Chart_2mil.png)

## World Map of Coronavirus tweet GPS coordinates of 500k tweets
![World GPS Map](https://github.com/JAWolfe04/CS5540-Big-Data-Project/blob/master/Screenshots/GPS%20Map.png)

## Multiple Line Graph of Top 10 hastags over time of 500k tweets
![Top 10 Line Graph](https://github.com/JAWolfe04/CS5540-Big-Data-Project/blob/master/Screenshots/Hashtags%20over%20time.png)

## Stacked Area Graph of Most retweeted tweet of corona with follower count and groups of 500k tweets
![Stacked Area Graph](https://github.com/JAWolfe04/CS5540-Big-Data-Project/blob/master/Screenshots/Retweet_Area_Chart.png)

## Layered Bar Graph of News agency activity of 500k tweets
![News Layered Bar Graph](https://github.com/JAWolfe04/CS5540-Big-Data-Project/blob/master/Screenshots/News_Activity.png)

---

# Code
The code is stored and managed via GitHub. It is available at [Wolfe-Skoglund GitHub code](https://github.com/JAWolfe04/CS5540-Big-Data-Project)
---

# Demo and Setup
### The Demo will be shown to the instructor and TA's at a convenient date/time.

### Here are the instructions for setting up and displaying the data analysis.
1. If you are using using Docker Toolbox or Docker Machine, which is running Docker on a Linux VM, you will need to add the jawhf4/twitterserver container ID to the VM running Docker with the host and guest ports both 8001. Follow the instructions explained in [Using Docker containers as localhost on Mac/Windows](https://www.jhipster.tech/tips/020_tip_using_docker_containers_as_localhost_on_mac_and_windows.html).
2. Then enter the following commands in the Docker CLI to pull the images from DockerHub: 
    * docker pull jawhf4/twitterproject:app
    * docker pull jawhf4/twitterproject:server
3. Now you can run the web app from the Docker CLI with:
    * docker container run -d -p 8100:8100 jawhf4/twitterproject:app
4. Finally you can run the Spark server, which will display the activity in Docker and will need to post a message about the server listening on localhost:8001 before the web application can begin interacting with the Spark REST API server, from the Docker CLI with:
    * docker container run -p 8001:8001 -v "/location_of_your_dataset:/mnt/data" jawhf4/twitterproject:server

---

# Work Assignments

- Installations & Setup: 
  * Wolfe
  * Skoglund
- Coding:
  * Wolfe \(99%\)
  * Skoglund \(1%\)
- Phase #2 documentation:
  * Wolfe
  * Skoglund
 
---

# References

1. [GitHub REST API | Get remote repo files list & download file content programmatically without cloning in local](https://itsallbinary.com/github-rest-api-get-remote-github-repo-files-list-download-file-content-programmatically-without-cloning-in-local/)
2. [Building Real-time interactions with Spark](https://spoddutur.github.io/spark-notes/build-real-time-interations-with-spark.html)
3. [How to send HTTP request GET/POST in Java](https://mkyong.com/java/how-to-send-http-request-getpost-in-java/)
4. [Embedding Jetty](https://www.eclipse.org/jetty/documentation/current/embedding-jetty.html)
5. [Twitter search API- Get tweets and tweets count of hashtag using JAVA twitter client Twitter4j](http://jkoder.com/twitter-search-api-get-tweets-and-tweets-count-hashtag-java-client-twitter4j/)
6. [Docker and Java Application examples](https://mkyong.com/docker/docker-and-java-application-examples/)
7. [#BotSpot: Twelve Ways to Spot a Bot](https://medium.com/dfrlab/botspot-twelve-ways-to-spot-a-bot-aedc7d9c110c)
8. [D3-cloud Github](https://github.com/jasondavies/d3-cloud)
9. [Create a simple Donut Chart using D3.js](http://www.adeveloperdiary.com/d3-js/create-a-simple-donut-chart-using-d3-js/)
10. [Using Docker containers as localhost on Mac/Windows](https://www.jhipster.tech/tips/020_tip_using_docker_containers_as_localhost_on_mac_and_windows.html)
11. [Map-with-Latitude-Longitude](http://bl.ocks.org/lokesh005/7640d9b562bf59b561d6)
12. [D3.js Stacked Bar Chart](https://codepen.io/benlister/pen/bNeLQy?editors=0010)
13. [How to create a stacked area chart with D3](https://medium.com/@louisemoxy/how-to-create-a-stacked-area-chart-with-d3-28a2fee0b8ca)
14. [Multi-line graph 4 with v4: Toggle](https://blockbuilder.org/pmia2/9f52cae2c17b4a0d4d5aff9d2c8a0eef)
