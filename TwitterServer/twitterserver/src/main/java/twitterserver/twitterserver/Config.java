package twitterserver.twitterserver;

public class Config {
	public static final String sparkMaster = "local[2]";
	public static final String appname = "TwitterServer";
	public static final String host = "0.0.0.0";
	public static final int port = 8001;
	public static final int timeout = 30000;
	public static final boolean runServer = true;
	public static final String path = "/mnt/data";
}
