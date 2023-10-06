function LCDZeile0 (row: number) {
    if (input.buttonIsPressed(Button.B)) {
        lcd16x2rgb.writeText(lcd16x2rgb.lcd16x2_eADDR(lcd16x2rgb.eADDR_LCD.LCD_16x2), row, 3, 11, lcd16x2rgb.lcd16x2_text(bit.formatNumber(dipswitch.getBIN(), bit.eLength.BIN_11111111)))
    } else {
        lcd16x2rgb.writeText(lcd16x2rgb.lcd16x2_eADDR(lcd16x2rgb.eADDR_LCD.LCD_16x2), row, 0, 11, lcd16x2rgb.lcd16x2_text(rtcpcf85063tp.getDate(rtcpcf85063tp.ePart.mit, rtcpcf85063tp.ePart.ohne)))
    }
}
function Hintergrundfarbe () {
    if (dipswitch.getON(dipswitch.eSwitch.DIP4, dipswitch.eONOFF.ON)) {
        rot = 63
    } else {
        rot = 0
    }
    if (dipswitch.getON(dipswitch.eSwitch.DIP5, dipswitch.eONOFF.ON)) {
        grün = 63
    } else {
        grün = 0
    }
    if (dipswitch.getON(dipswitch.eSwitch.DIP6, dipswitch.eONOFF.ON)) {
        blau = 63
    } else {
        blau = 0
    }
    lcd16x2rgb.setRGB(lcd16x2rgb.lcd16x2rgb_eADDR(lcd16x2rgb.eADDR_RGB.RGB_16x2_V5), rot, grün, blau)
}
function Speicherkarte () {
    Dateiname = "" + rtcpcf85063tp.getyyMMddHHmmss(0, 8) + ".CSV"
    lcd16x2rgb.writeText(lcd16x2rgb.lcd16x2_eADDR(lcd16x2rgb.eADDR_LCD.LCD_16x2), 0, 0, 11, lcd16x2rgb.lcd16x2_text(Dateiname))
    lcd16x2rgb.writeText(lcd16x2rgb.lcd16x2_eADDR(lcd16x2rgb.eADDR_LCD.LCD_16x2), 1, 3, 11, lcd16x2rgb.lcd16x2_text(rtcpcf85063tp.getTime(rtcpcf85063tp.ePart.mit)))
    qwiicopenlog.writeFile(qwiicopenlog.qwiicopenlog_eADDR(qwiicopenlog.eADDR.LOG_x2A), Dateiname, "" + Dateiname + ";" + rtcpcf85063tp.getDate(rtcpcf85063tp.ePart.mit, rtcpcf85063tp.ePart.mit) + ";" + rtcpcf85063tp.getTime(rtcpcf85063tp.ePart.mit) + ";" + bit.formatNumber(dipswitch.readBIN(dipswitch.dipswitch_eADDR(dipswitch.eADDR.DIP_SWITCH_x03)), bit.eLength.BIN_11111111) + ";" + input.temperature() + "°C;x:" + DrehungX + ";y:" + DrehungY + ";INT:" + bHardwareInterrupt + ";RGB:" + bRGBvorhanden, qwiicopenlog.eCRLF.CRLF)
}
function Binäruhr25LEDs () {
    _("DIP Schalter 2:Zeit 2+3:Datum 3:löschen aus:Matrix unverändert lassen")
    if (dipswitch.getON(dipswitch.eSwitch.DIP2, dipswitch.eONOFF.ON) && dipswitch.getON(dipswitch.eSwitch.DIP3, dipswitch.eONOFF.ON)) {
        rtcpcf85063tp.anzeige25LED(rtcpcf85063tp.e25LED.Datum)
    } else if (dipswitch.getON(dipswitch.eSwitch.DIP2, dipswitch.eONOFF.ON)) {
        rtcpcf85063tp.anzeige25LED(rtcpcf85063tp.e25LED.Zeit)
    } else if (dipswitch.getON(dipswitch.eSwitch.DIP3, dipswitch.eONOFF.ON)) {
        basic.clearScreen()
    }
}
input.onButtonEvent(Button.AB, input.buttonEventClick(), function () {
    _("schaltet i2c Lagesensor x-y an")
    bLagesensor = true
})
function LCDZeile1 (row: number) {
    lcd16x2rgb.writeText(lcd16x2rgb.lcd16x2_eADDR(lcd16x2rgb.eADDR_LCD.LCD_16x2), row, 3, 11, lcd16x2rgb.lcd16x2_text(rtcpcf85063tp.getTime(rtcpcf85063tp.ePart.mit)))
}
function _ (Kommentar: string) {
	
}
pins.onPulsed(DigitalPin.P0, PulseValue.Low, function () {
    _("wenn Pin mit CLK am Uhr Modul per Draht verbunden ist, kann der Hardware-Interrupt (1 Sekunde) benutzt werden")
    bHardwareInterrupt = true
    lcd16x2rgb.writeText(lcd16x2rgb.lcd16x2_eADDR(lcd16x2rgb.eADDR_LCD.LCD_16x2), 0, 0, 0, lcd16x2rgb.lcd16x2_text(String.fromCharCode(bit.hex8(bit.eHEX8bit.xE9))))
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
