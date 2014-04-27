function reportingResults()
{
   var window = window.open("");
   if (window!=null) {  // Hat das Öffnen 
                         // des Fensters geklappt?
      window.document.open();  // Öffnen für 
                                // Schreibzugriff, Pflicht!
      window.document.write(tag("html") + tag("body"));
      window.document.write(tag("h1") + "Reporting" +
        tag ("/h1"));
      window.document.write(tag("/body") +
        tag ("/html"));
      window.document.close();  // Schreibzugriff
                                 // beenden, Pflicht!
}
