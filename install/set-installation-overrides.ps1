Param(
    [string] $configurationFile = "configuration-xc0.json"
)

Write-Host "Setting Local Overrides in $configurationFile"

$json = Get-Content -Raw $configurationFile |  ConvertFrom-Json

# Assets and prerequisites

$assets = $json.assets
$assets.root = "$PSScriptRoot\assets"
$assets.downloadFolder = Join-Path $assets.root "Downloads"
#Commerce
$assets.commerce.installationFolder = Join-Path $assets.root "Commerce"

# Settings

# Site Settings
$site = $json.settings.site

$commerce = $json.settings.commerce
$commerce.storefrontPrefix = "retail"
$commerce.storefrontHostName = $commerce.storefrontPrefix + "." + $site.suffix

$commerce.serviceAccountDomain = "$($Env:COMPUTERNAME)"
$commerce.serviceAccountUserName = "CSFndRuntimeUser"
$commerce.serviceAccountPassword = "Pu8azaCr"

$commerce.brainTreeAccountMerchandId = ""
$commerce.brainTreeAccountPublicKey = ""
$commerce.brainTreeAccountPrivateKey = ""

$commerce.identityServerName = "SitecoreIdentityServer"

# XConnect Parameters
$xConnect = $json.settings.xConnect


# Sitecore Parameters
$sitecore = $json.settings.sitecore

# Solr Parameters
$solr = $json.settings.solr

Set-Content $ConfigurationFile  (ConvertTo-Json -InputObject $json -Depth 4 )
