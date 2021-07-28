<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="/">
<html>
<body>
<xsl:choose>
<xsl:when test="function-available('sum')">
<p>sum() is supported.</p>
</xsl:when>
<xsl:otherwise>
<p>sum() is not supported.</p>
</xsl:otherwise>
</xsl:choose>
<xsl:choose>
<xsl:when test="function-available('current')">
<p>current() is supported.</p>
</xsl:when>
<xsl:otherwise>
<p>current() is not supported.</p>
</xsl:otherwise>
</xsl:choose>
</body>
</html>
</xsl:template>

</xsl:stylesheet>
