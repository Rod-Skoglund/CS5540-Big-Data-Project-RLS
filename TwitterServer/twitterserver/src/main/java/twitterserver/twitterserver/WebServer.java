package twitterserver.twitterserver;

import java.util.EnumSet;

import javax.servlet.DispatcherType;

import org.apache.log4j.Logger;
import org.apache.log4j.Level;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.ServerConnector;
import org.eclipse.jetty.servlet.FilterHolder;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlets.CrossOriginFilter;

import twitterserver.twitterserver.handler.*;
import twitterserver.twitterserver.Config;

public class WebServer {
	
	public Server createServer() {
		Logger.getRootLogger().setLevel(Level.INFO);
		Server server = new Server();
		
		ServerConnector http = new ServerConnector(server);
		http.setHost(Config.host);
		http.setPort(Config.port);
		http.setIdleTimeout(Config.timeout);		
		server.addConnector(http);
		
		ServletContextHandler context = new ServletContextHandler(ServletContextHandler.SESSIONS);
		context.setContextPath("/");
		server.setHandler(context);
		
		FilterHolder cors = new FilterHolder(CrossOriginFilter.class);
		cors.setInitParameter(CrossOriginFilter.ALLOWED_ORIGINS_PARAM, "*");
		cors.setInitParameter(CrossOriginFilter.ACCESS_CONTROL_ALLOW_ORIGIN_HEADER, "*");
		cors.setInitParameter(CrossOriginFilter.ALLOWED_METHODS_PARAM, "OPTIONS,GET,POST,PUT,DELETE,HEAD");
		cors.setInitParameter(CrossOriginFilter.ALLOWED_HEADERS_PARAM, "X-Requested-With,Content-Type,Accept,Origin,Cache-Control");
		cors.setInitParameter(CrossOriginFilter.CHAIN_PREFLIGHT_PARAM, "false");

		context.addFilter(cors, "/*", EnumSet.of(DispatcherType.INCLUDE, DispatcherType.REQUEST));
		
		context.addServlet(RootHandler.class, "/");
		context.addServlet(BubbleChartHandler.class, "/bubblechart");
		context.addServlet(BotHandler.class, "/bots");
		context.addServlet(InfluencerHandler.class, "/influencers");
		context.addServlet(Top10HashHandler.class, "/top10hashtags");
		context.addServlet(GeoHandler.class, "/geodata");
		context.addServlet(NewsHandler.class, "/newsdata");
		context.addServlet(TweetFreqHandler.class, "/tweetfreqdata");
		context.addServlet(CountryHandler.class, "/countrydata");
		context.addServlet(MostRetweetedHandler.class, "/mostretweeted");
		context.addServlet(TopHashTimeHandler.class, "/tophashtime");
		
		return server;
	}
}
