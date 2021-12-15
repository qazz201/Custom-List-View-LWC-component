
public with sharing class ListViewController {
    private static final String requestUrl = URL.getSalesforceBaseUrl().toExternalForm() + '/services/data/v53.0/sobjects/{0}/listviews/{1}/describe';

    @AuraEnabled(cacheable=true)
    public static String getSessionId() {
        return Page.GenerateSessionId.getContent().toString().trim();
    }

    @AuraEnabled(cacheable=true)
    public static List<ListView> getListViewsBySobjectType(String sObjectType) {
        return [SELECT Id, Name, DeveloperName FROM ListView where SobjectType = :sObjectType];
    }

    @AuraEnabled(cacheable=true)
    public static List<SObject> getListViewRecords(String sObjectType, String listViewId, String searchRequest, String userSessionId) {
        System.debug(sObjectType);
        System.debug(listViewId + '__' + String.isBlank(listViewId));
        System.debug(searchRequest);
        System.debug(requestUrl);

        if ((sObjectType == null || String.isBlank(sObjectType))
                || (listViewId == null || String.isBlank(listViewId))) return null;

        if (userSessionId == null) userSessionId = getSessionId();

        String formattedUrl = String.format(requestUrl, new List<String>{
                sObjectType, listViewId
        });

        try {
            String query = (String) new RestService(formattedUrl, userSessionId)
                    .get()
                    .get('query');

            return Database.query(query);
        } catch (Exception ex) {
            System.debug(ex);
        }
        return null;
    }

    private static String modifyQuery() {
        return null;
    }
}