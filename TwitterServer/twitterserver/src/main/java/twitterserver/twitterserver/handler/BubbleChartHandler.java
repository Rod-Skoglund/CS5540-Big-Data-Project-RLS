package twitterserver.twitterserver.handler;

import org.apache.log4j.Logger;

import java.io.IOException;
import java.io.PrintWriter;

import twitterserver.twitterserver.SparkFactory;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@SuppressWarnings("serial")
public class BubbleChartHandler extends HttpServlet {

	@Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
		response.setContentType("application/json");
		response.setStatus(HttpServletResponse.SC_OK);
		Logger.getRootLogger().info("Getting Bubble Chart Data");
		
		PrintWriter out = response.getWriter();
		out.println(SparkFactory.getInstance().getBubbleChartData());
	
		Logger.getRootLogger().info("Finished Bubble Chart Data");
	}
}
