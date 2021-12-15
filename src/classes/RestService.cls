
public with sharing class RestService {
    private String url;
    private String userSessionId;

    public RestService(String url) {
        this.url = url;
    }

    public RestService(String url, String userSessionId) {
        this.url = url;
        this.userSessionId = userSessionId;
    }

    public Map<String, Object> get() {
        return this.execute('GET');
    }

    private Map<String, Object> execute(String method) {
        if (method == null || this.url == null) return null;
        this.userSessionId = (this.userSessionId == null ? UserInfo.getSessionId() : this.userSessionId);

        HttpRequest httpRequest = new HttpRequest();
        httpRequest.setMethod(method);
        httpRequest.setEndpoint(this.url);
        httpRequest.setHeader('Authorization', 'Bearer ' + this.userSessionId);

        try {
            HttpResponse httpResponse = new Http().send(httpRequest);
            System.debug(httpResponse.getStatusCode());
            if (httpResponse.getStatusCode() == 200) {
                return (Map<String, Object>) JSON.deserializeUntyped(httpResponse.getBody());
            } else {
                System.debug(httpResponse.getBody());
            }
        } catch (Exception ex) {
            System.debug('Exception' + ex);
            return null;
        }

        return null;
    }
}

//Example:
//new RestService(
// URL.getSalesforceBaseUrl().toExternalForm()+'/services/data/v53.0/sobjects/Contact/listviews/00B7Q000006ZWmLUAW/describe')
//        .get()
//        .get('query')