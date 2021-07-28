<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="/">
<html>
<body>
<xsl:value-of select='format-number(500100, "#")' />
<br />
<xsl:value-of select='format-number(500100, "0")' />
<br />
<xsl:value-of select='format-number(500100, "#.00")' />
<br />
<xsl:value-of select='format-number(500100, "#.0")' />
<br />
<xsl:value-of select='format-number(500100, "###,###.00")' />
<br />
<xsl:value-of select='format-number(0.23456, "#%")' />
</body>
</html>
</xsl:template>

</xsl:stylesheet>
