<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="/">
<html>
<body>
<h3>Artists:</h3>
<ul>
<xsl:for-each select="catalog/cd">
  <li>
  <a href="#{generate-id(artist)}">
  <xsl:value-of select="artist" /></a>
  </li>
</xsl:for-each>
</ul>
<hr />
<xsl:for-each select="catalog/cd">
  Artist: <a id="{generate-id(artist)}">
  <xsl:value-of select="artist" /></a>
  <br />
  Title: <xsl:value-of select="title" />
  <br />
  Price: <xsl:value-of select="price" />
  <hr />
</xsl:for-each>
</body>
</html>
</xsl:template>

</xsl:stylesheet>
