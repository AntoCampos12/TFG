# Generated by Django 4.1.5 on 2023-06-12 09:59

from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Actualizar',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('actualizar', models.IntegerField(default=0, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(1)])),
            ],
        ),
        migrations.CreateModel(
            name='Equipos',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=25)),
                ('presupuesto', models.IntegerField(default=150000000)),
                ('actualizar', models.IntegerField(default=0, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(1)])),
                ('puntuacion', models.FloatField(default=0.0)),
            ],
        ),
        migrations.CreateModel(
            name='Jugador',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=100)),
                ('equipo', models.CharField(max_length=100)),
                ('foto', models.CharField(default='noProcede', max_length=100)),
                ('posicion', models.CharField(default='banquillo', max_length=100)),
                ('rating', models.FloatField(default=0.0)),
            ],
        ),
        migrations.CreateModel(
            name='Liga',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=25)),
                ('public', models.BooleanField(default=True)),
                ('password', models.CharField(blank=True, max_length=25, null=True)),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Jornada',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rating', models.FloatField(default=0.0)),
                ('jornada', models.IntegerField(default=0)),
                ('jugador', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='authentication.jugador')),
            ],
        ),
        migrations.CreateModel(
            name='Exchange',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('jugadores_ofrece', models.ManyToManyField(related_name='jugadores_ofrece+', to='authentication.jugador')),
                ('jugadores_recibe', models.ManyToManyField(related_name='jugadores_recibe+', to='authentication.jugador')),
                ('usuario_ofrece', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='usuario_ofrece', to='authentication.equipos')),
                ('usuario_recibe', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='usuario_recibe', to='authentication.equipos')),
            ],
        ),
        migrations.AddField(
            model_name='equipos',
            name='liga',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='authentication.liga'),
        ),
        migrations.AddField(
            model_name='equipos',
            name='owner',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.CreateModel(
            name='EquipoJugador',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('posicion', models.CharField(choices=[('POR', 'PORTERO'), ('LI', 'LATERAL IZQUIERDO'), ('LD', 'LATERAL DERECHO'), ('DFCD', 'DEFENSA CENTRAL DERECHO'), ('DFCI', 'DEFENSA CENTRAL IZQUIERDO'), ('MCD', 'CENTROCAMPISTA DEFENSIVO'), ('MI', 'CENTROCAMPISTA IZQUIERDO'), ('MD', 'CENTROCAMPISTA DERECHO'), ('DC', 'DELANTERO CENTRO'), ('EI', 'EXTREMO IZQUIERDO'), ('ED', 'EXTREMO DERECHO'), ('SUS', 'BANQUILLO')], default='SUS', max_length=50)),
                ('equipo', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='authentication.equipos')),
                ('jugador', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='authentication.jugador')),
                ('liga', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='authentication.liga')),
            ],
        ),
    ]
