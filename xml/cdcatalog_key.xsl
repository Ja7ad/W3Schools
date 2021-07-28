<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:key name="cdlist" match="cd" use="title" />

<xsl:template match="/">
<html>
<body>
<xsl:for-each select="key('cdlist', 'Empire Burlesque')">
<p>
Title: <xsl:value-of select="title" />
<br />
Artist: <xsl:value-of select="artist" />
<br />
Price: <xsl:value-of select="price" />
</p>
</xsl:for-each>
</body>
</html>
</xsl:template>

</xsl:stylesheet>
