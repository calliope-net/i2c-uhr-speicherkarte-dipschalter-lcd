function LCDZeile0 (row: number) {
    if (input.buttonIsPressed(Button.B)) {
    	
    } else {
    	
    }
}
function Hintergrundfarbe () {
    if (true) {
        rot = 63
    } else {
        rot = 0
    }
    if (true) {
        grün = 63
    } else {
        grün = 0
    }
    if (true) {
        blau = 63
    } else {
        blau = 0
    }
}
function Speicherkarte () {
    Dateiname = "" + ".CSV"
    qwiicopenlog.writeFile(qwiicopenlog.eADDR.LOG_Qwiic, Dateiname, "" + Dateiname + ";" + "" + ";" + "" + ";" + bit.formatNumber(0, bit.eLength.BIN_11111111) + ";" + input.temperature() + "°C;x:" + DrehungX + ";y:" + DrehungY + ";INT:" + bHardwareInterrupt + ";RGB:" + bRGBvorhanden, qwiicopenlog.eCRLF.CRLF)
}
function Binäruhr25LEDs () {
    _("DIP Schalter 2:Zeit 2+3:Datum 3:löschen aus:Matrix unverändert lassen")
    if (true && true) {
    	
    } else if (true) {
    	
    } else if (true) {
        basic.clearScreen()
    }
}
input.onButtonEvent(Button.AB, input.buttonEventClick(), function () {
    _("schaltet i2c Lagesensor x-y an")
    bLagesensor = true
})
function LCDZeile1 (row: number) {
	
}
function _ (Kommentar: string) {
	
}
pins.onPulsed(DigitalPin.P0, PulseValue.Low, function () {
    _("wenn Pin mit CLK am Uhr Modul per Draht verbunden ist, kann der Hardware-Interrupt (1 Sekunde) benutzt werden")
    bHardwareInterrupt = true
    i2cCode()
})
function i2cCode () {
    _("Code, der den i2c Bus aufruft, darf nur in einem Ereignis (im selben Thread) stehen")
    Binäruhr25LEDs()
    if (bLagesensor) {
        DrehungX = input.rotation(Rotation.Pitch)
        DrehungY = input.rotation(Rotation.Roll)
    }
    if (bRGBvorhanden) {
        Hintergrundfarbe()
    }
    if (true) {
        LCDZeile0(0)
        LCDZeile1(1)
    } else if (0 == 0) {
        Speicherkarte()
    }
}
let DrehungY = 0
let DrehungX = 0
let Dateiname = ""
let blau = 0
let grün = 0
let rot = 0
let bRGBvorhanden = false
let bHardwareInterrupt = false
let bLagesensor = false
bLagesensor = false
bHardwareInterrupt = false
_("i2c Adresse RGB nur aufrufen, wenn einer der Schalter 4-5-6 ON ist")
if (bit.bitwise(0, bit.eBit.AND, bit.parseint("111000")) != 0) {
    bRGBvorhanden = true
}
loops.everyInterval(1000, function () {
    _("hier kann die Funktion i2cCode aufgerufen werden ohne Hardware-Interrupt")
    if (!(bHardwareInterrupt)) {
        i2cCode()
    }
})
