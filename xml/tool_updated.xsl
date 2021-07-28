<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="/">
<html>
<body>
<h2>Updated Tool Information:</h2>
<table border="1">
<xsl:for-each select="tool/field">
<tr>
<td><xsl:value-of select="@id" /></td>
<td><xsl:value-of select="value" /></td>
</tr>
</xsl:for-each>
</table>
</body>
</html>
</xsl:template>
</xsl:stylesheet>