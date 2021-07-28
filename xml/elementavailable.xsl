<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="/">
<html>
<body>
<xsl:choose>
<xsl:when test="element-available('xsl:comment')">
  <p>xsl:comment is supported.</p>
</xsl:when>
<xsl:otherwise>
  <p>xsl:comment is not supported.</p>
</xsl:otherwise>
</xsl:choose>
<xsl:choose>
<xsl:when test="element-available('xsl:delete')">
  <p>xsl:delete is supported.</p>
</xsl:when>
<xsl:otherwise>
  <p>xsl:delete is not supported.</p>
</xsl:otherwise>
</xsl:choose>
</body>
</html>
</xsl:template>

</xsl:stylesheet>
